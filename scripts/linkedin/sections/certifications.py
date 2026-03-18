"""Add LinkedIn Certifications (Licenses & Certifications)."""

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


def add_certification(page: Page, data: dict) -> dict:
    """Add a new certification/license entry.

    Args:
        page: Authenticated Playwright page.
        data: Dict with certification details:
            - name (str): Certification name (required)
            - issuing_org (str): Issuing organization (required)
            - issue_month (str): e.g. "January"
            - issue_year (str): e.g. "2024"
            - expiry_month (str): e.g. "December" (omit if no expiry)
            - expiry_year (str): e.g. "2027" (omit if no expiry)
            - no_expiry (bool): True if credential doesn't expire
            - credential_id (str): Credential ID
            - credential_url (str): Credential URL

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "licenses_and_certifications")

    if section and section.count() > 0:
        try:
            click_add_button(page, section)
        except Exception:
            add_btn = page.locator(
                'button[aria-label*="Add license"], '
                'button[aria-label*="Add certification"], '
                'button[aria-label*="add certification"]'
            ).first
            if add_btn.count() > 0:
                add_btn.click()
                page.wait_for_timeout(1000)
            else:
                screenshot_path = take_screenshot(page, "cert_add_not_found")
                return {
                    "status": "error",
                    "message": "Could not find add certification button",
                    "screenshot": screenshot_path,
                }
    else:
        # Use "Add profile section"
        add_btn = page.locator('button:has-text("Add profile section")').first
        if add_btn.count() > 0:
            add_btn.click()
            page.wait_for_timeout(1000)
            cert_option = page.locator(
                'button:has-text("License"), '
                'button:has-text("Certification"), '
                'li:has-text("License"), '
                'li:has-text("Certification")'
            ).first
            if cert_option.count() > 0:
                cert_option.click()
                page.wait_for_timeout(1000)

    modal = wait_for_modal(page)

    # Fill certification name
    if "name" in data:
        try:
            fill_field(page, "Name", data["name"], modal)
        except ValueError:
            name_input = modal.locator("input").first
            if name_input.count() > 0:
                name_input.click()
                name_input.fill(data["name"])

    # Fill issuing organization
    if "issuing_org" in data:
        org_input = modal.locator(
            'input[aria-label*="Issuing organization"], '
            'input[aria-label*="issuing"], '
            'input[id*="issuing"]'
        ).first
        if org_input.count() == 0:
            try:
                fill_field(page, "Issuing organization", data["issuing_org"], modal)
            except ValueError:
                pass
        else:
            org_input.click()
            org_input.fill(data["issuing_org"])
            page.wait_for_timeout(1000)
            # Try autocomplete
            suggestion = page.locator('div[role="option"]').first
            if suggestion.count() > 0:
                suggestion.click()
                page.wait_for_timeout(300)
            else:
                org_input.press("Escape")

    # Handle "This credential does not expire" checkbox
    if data.get("no_expiry", False):
        checkbox = modal.locator(
            'input[type="checkbox"][id*="expire"], '
            'label:has-text("does not expire")'
        ).first
        if checkbox.count() > 0:
            if checkbox.get_attribute("type") == "checkbox":
                if not checkbox.is_checked():
                    checkbox.click()
            else:
                checkbox.click()
            page.wait_for_timeout(500)

    # Issue date
    if "issue_month" in data:
        try:
            select_dropdown(page, "Issue month", data["issue_month"], modal)
        except ValueError:
            pass

    if "issue_year" in data:
        try:
            select_dropdown(page, "Issue year", data["issue_year"], modal)
        except ValueError:
            pass

    # Expiry date
    if not data.get("no_expiry", False):
        if "expiry_month" in data:
            try:
                select_dropdown(page, "Expiration month", data["expiry_month"], modal)
            except ValueError:
                pass

        if "expiry_year" in data:
            try:
                select_dropdown(page, "Expiration year", data["expiry_year"], modal)
            except ValueError:
                pass

    # Credential ID
    if "credential_id" in data:
        try:
            fill_field(page, "Credential ID", data["credential_id"], modal)
        except ValueError:
            pass

    # Credential URL
    if "credential_url" in data:
        try:
            fill_field(page, "Credential URL", data["credential_url"], modal)
        except ValueError:
            pass

    click_save(page, modal)

    cert_name = data.get("name", "Unknown")
    return {
        "status": "success",
        "message": f"Added certification: {cert_name}",
        "section": "certifications",
    }
