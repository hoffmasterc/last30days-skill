"""Add and edit LinkedIn Education entries."""

from playwright.sync_api import Page
from ..profile import (
    go_to_profile,
    scroll_to_section,
    click_add_button,
    wait_for_modal,
    click_save,
    fill_field,
    select_dropdown,
    take_screenshot,
)


def _fill_education_form(page: Page, modal, data: dict):
    """Fill in an education form modal.

    Args:
        page: Playwright page.
        modal: Modal locator.
        data: Dict with keys: school, degree, field_of_study, start_year,
              end_year, grade, activities, description.
    """
    if "school" in data:
        school_input = modal.locator(
            'input[aria-label*="School"], '
            'input[id*="school"], '
            'input[placeholder*="school"]'
        ).first
        if school_input.count() > 0:
            school_input.click()
            school_input.fill("")
            school_input.fill(data["school"])
            page.wait_for_timeout(1000)
            # Try autocomplete
            suggestion = page.locator(f'div[role="option"]').first
            if suggestion.count() > 0:
                suggestion.click()
                page.wait_for_timeout(500)
            else:
                school_input.press("Escape")
                page.wait_for_timeout(300)

    if "degree" in data:
        try:
            fill_field(page, "Degree", data["degree"], modal)
            page.wait_for_timeout(500)
            suggestion = page.locator('div[role="option"]').first
            if suggestion.count() > 0:
                suggestion.click()
                page.wait_for_timeout(300)
        except ValueError:
            pass

    if "field_of_study" in data:
        try:
            fill_field(page, "Field of study", data["field_of_study"], modal)
        except ValueError:
            try:
                fill_field(page, "Field of Study", data["field_of_study"], modal)
            except ValueError:
                pass

    if "start_year" in data:
        try:
            select_dropdown(page, "Start year", data["start_year"], modal)
        except ValueError:
            selects = modal.locator("select").all()
            if len(selects) >= 1:
                selects[0].select_option(label=data["start_year"])

    if "end_year" in data:
        try:
            select_dropdown(page, "End year", data["end_year"], modal)
        except ValueError:
            selects = modal.locator("select").all()
            if len(selects) >= 2:
                selects[1].select_option(label=data["end_year"])

    if "grade" in data:
        try:
            fill_field(page, "Grade", data["grade"], modal)
        except ValueError:
            pass

    if "activities" in data:
        try:
            fill_field(page, "Activities", data["activities"], modal)
        except ValueError:
            pass

    if "description" in data:
        desc_field = modal.locator("textarea").first
        if desc_field.count() > 0:
            desc_field.click()
            desc_field.fill("")
            desc_field.fill(data["description"])
            page.wait_for_timeout(300)


def add_education(page: Page, data: dict) -> dict:
    """Add a new education entry.

    Args:
        page: Authenticated Playwright page.
        data: Dict with education details:
            - school (str): School name (required)
            - degree (str): e.g. "Bachelor's degree"
            - field_of_study (str): e.g. "Computer Science"
            - start_year (str): e.g. "2018"
            - end_year (str): e.g. "2022"
            - grade (str): e.g. "3.8 GPA"
            - activities (str): Activities and societies
            - description (str): Additional description

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "education")

    if section and section.count() > 0:
        try:
            click_add_button(page, section)
        except Exception:
            add_btn = page.locator(
                'button[aria-label*="Add education"], '
                'button[aria-label*="add education"]'
            ).first
            if add_btn.count() > 0:
                add_btn.click()
                page.wait_for_timeout(1000)
            else:
                screenshot_path = take_screenshot(page, "edu_add_not_found")
                return {
                    "status": "error",
                    "message": "Could not find add education button",
                    "screenshot": screenshot_path,
                }
    else:
        add_btn = page.locator('button:has-text("Add profile section")').first
        if add_btn.count() > 0:
            add_btn.click()
            page.wait_for_timeout(1000)
            edu_option = page.locator(
                'button:has-text("Education"), '
                'li:has-text("Education")'
            ).first
            if edu_option.count() > 0:
                edu_option.click()
                page.wait_for_timeout(1000)

    modal = wait_for_modal(page)
    _fill_education_form(page, modal, data)
    click_save(page, modal)

    school = data.get("school", "Unknown")
    return {
        "status": "success",
        "message": f"Added education: {school}",
        "section": "education",
    }


def edit_education(page: Page, school_name: str, data: dict) -> dict:
    """Edit an existing education entry.

    Args:
        page: Authenticated Playwright page.
        school_name: Text to match against existing entries.
        data: Dict with fields to update.

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "education")
    if not section or section.count() == 0:
        return {
            "status": "error",
            "message": "No education section found on profile",
        }

    entry = section.locator(f'li:has-text("{school_name}")').first
    if entry.count() == 0:
        return {
            "status": "error",
            "message": f"Could not find education entry matching: {school_name}",
        }

    edit_btn = entry.locator('button[aria-label*="Edit"]').first
    if edit_btn.count() > 0:
        edit_btn.click()
        page.wait_for_timeout(1000)
    else:
        entry.click()
        page.wait_for_timeout(1000)

    modal = wait_for_modal(page)
    _fill_education_form(page, modal, data)
    click_save(page, modal)

    return {
        "status": "success",
        "message": f"Updated education: {school_name}",
        "section": "education",
    }
