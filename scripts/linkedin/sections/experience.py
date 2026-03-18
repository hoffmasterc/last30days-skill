"""Add and edit LinkedIn Experience entries."""

from playwright.sync_api import Page
from ..profile import (
    go_to_profile,
    scroll_to_section,
    click_add_button,
    click_edit_button,
    wait_for_modal,
    click_save,
    fill_field,
    select_dropdown,
    take_screenshot,
)


def _fill_experience_form(page: Page, modal, data: dict):
    """Fill in an experience form modal with the provided data.

    Args:
        page: Playwright page.
        modal: Modal locator.
        data: Dict with keys: title, company, location, start_month, start_year,
              end_month, end_year, current (bool), description, employment_type.
    """
    if "title" in data:
        fill_field(page, "Title", data["title"], modal)

    if "company" in data:
        company_input = modal.locator(
            'input[aria-label*="Company"], '
            'input[id*="company"], '
            'input[placeholder*="company"]'
        ).first
        if company_input.count() > 0:
            company_input.click()
            company_input.fill("")
            company_input.fill(data["company"])
            page.wait_for_timeout(1000)
            # Select from autocomplete dropdown if it appears
            suggestion = page.locator(
                f'div[role="option"]:has-text("{data["company"]}"), '
                f'li:has-text("{data["company"]}")'
            ).first
            if suggestion.count() > 0:
                suggestion.click()
                page.wait_for_timeout(500)
            else:
                # Press escape to dismiss any dropdown
                company_input.press("Escape")
                page.wait_for_timeout(300)

    if "employment_type" in data:
        try:
            select_dropdown(page, "Employment type", data["employment_type"], modal)
        except ValueError:
            pass  # Not critical if this fails

    if "location" in data:
        try:
            fill_field(page, "Location", data["location"], modal)
            page.wait_for_timeout(500)
            # Try to select from autocomplete
            suggestion = page.locator('div[role="option"]').first
            if suggestion.count() > 0:
                suggestion.click()
                page.wait_for_timeout(300)
        except ValueError:
            pass

    # Handle "I currently work here" checkbox
    if data.get("current", False):
        checkbox = modal.locator(
            'input[type="checkbox"][id*="current"], '
            'label:has-text("currently work")'
        ).first
        if checkbox.count() > 0:
            if checkbox.get_attribute("type") == "checkbox":
                if not checkbox.is_checked():
                    checkbox.click()
            else:
                checkbox.click()
            page.wait_for_timeout(500)

    # Start date
    if "start_month" in data:
        try:
            select_dropdown(page, "Start date month", data["start_month"], modal)
        except ValueError:
            # Try alternate label patterns
            month_selects = modal.locator('select').all()
            if len(month_selects) >= 1:
                month_selects[0].select_option(label=data["start_month"])

    if "start_year" in data:
        try:
            select_dropdown(page, "Start date year", data["start_year"], modal)
        except ValueError:
            year_selects = modal.locator('select').all()
            if len(year_selects) >= 2:
                year_selects[1].select_option(label=data["start_year"])

    # End date (only if not current)
    if not data.get("current", False):
        if "end_month" in data:
            try:
                select_dropdown(page, "End date month", data["end_month"], modal)
            except ValueError:
                month_selects = modal.locator('select').all()
                if len(month_selects) >= 3:
                    month_selects[2].select_option(label=data["end_month"])

        if "end_year" in data:
            try:
                select_dropdown(page, "End date year", data["end_year"], modal)
            except ValueError:
                year_selects = modal.locator('select').all()
                if len(year_selects) >= 4:
                    year_selects[3].select_option(label=data["end_year"])

    if "description" in data:
        desc_field = modal.locator(
            'textarea[aria-label*="Description"], '
            'textarea[aria-label*="description"], '
            'div[role="textbox"][aria-label*="Description"], '
            'textarea[id*="description"]'
        ).first
        if desc_field.count() == 0:
            desc_field = modal.locator("textarea").first
        if desc_field.count() > 0:
            desc_field.click()
            desc_field.fill("")
            desc_field.fill(data["description"])
            page.wait_for_timeout(300)


def add_experience(page: Page, data: dict) -> dict:
    """Add a new experience entry to the profile.

    Args:
        page: Authenticated Playwright page.
        data: Dict with experience details:
            - title (str): Job title (required)
            - company (str): Company name (required)
            - employment_type (str): e.g. "Full-time", "Part-time", "Contract"
            - location (str): e.g. "San Francisco, CA"
            - start_month (str): e.g. "January"
            - start_year (str): e.g. "2024"
            - end_month (str): e.g. "March" (omit if current)
            - end_year (str): e.g. "2026" (omit if current)
            - current (bool): True if this is the current role
            - description (str): Role description

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "experience")

    if section and section.count() > 0:
        try:
            click_add_button(page, section)
        except Exception:
            # Try direct aria-label
            add_btn = page.locator(
                'button[aria-label*="Add position"], '
                'button[aria-label*="add experience"], '
                'button[aria-label*="Add experience"]'
            ).first
            if add_btn.count() > 0:
                add_btn.click()
                page.wait_for_timeout(1000)
            else:
                screenshot_path = take_screenshot(page, "exp_add_not_found")
                return {
                    "status": "error",
                    "message": "Could not find add experience button",
                    "screenshot": screenshot_path,
                }
    else:
        # No experience section - use "Add profile section"
        add_btn = page.locator('button:has-text("Add profile section")').first
        if add_btn.count() > 0:
            add_btn.click()
            page.wait_for_timeout(1000)
            exp_option = page.locator(
                'button:has-text("Add position"), '
                'li:has-text("Position")'
            ).first
            if exp_option.count() > 0:
                exp_option.click()
                page.wait_for_timeout(1000)

    modal = wait_for_modal(page)
    _fill_experience_form(page, modal, data)
    click_save(page, modal)

    title = data.get("title", "Unknown")
    company = data.get("company", "Unknown")
    return {
        "status": "success",
        "message": f"Added experience: {title} at {company}",
        "section": "experience",
    }


def edit_experience(page: Page, company_or_title: str, data: dict) -> dict:
    """Edit an existing experience entry.

    Finds the experience by matching company name or title, then updates
    the specified fields.

    Args:
        page: Authenticated Playwright page.
        company_or_title: Text to match against existing entries.
        data: Dict with fields to update (same keys as add_experience).

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "experience")
    if not section or section.count() == 0:
        return {
            "status": "error",
            "message": "No experience section found on profile",
        }

    # Find the specific experience entry
    entry = section.locator(f'li:has-text("{company_or_title}")').first
    if entry.count() == 0:
        # Try partial match
        entry = section.locator(f'div:has-text("{company_or_title}")').first

    if entry.count() == 0:
        return {
            "status": "error",
            "message": f"Could not find experience entry matching: {company_or_title}",
        }

    # Click edit on this entry
    edit_btn = entry.locator('button[aria-label*="Edit"]').first
    if edit_btn.count() == 0:
        # Try clicking the entry itself to navigate to edit
        entry.click()
        page.wait_for_timeout(1000)
    else:
        edit_btn.click()
        page.wait_for_timeout(1000)

    modal = wait_for_modal(page)
    _fill_experience_form(page, modal, data)
    click_save(page, modal)

    return {
        "status": "success",
        "message": f"Updated experience: {company_or_title}",
        "section": "experience",
    }
