"""Update LinkedIn profile headline.

The headline appears directly below the user's name on their profile.
It's edited via the intro/contact info edit modal.
"""

from playwright.sync_api import Page
from ..profile import (
    go_to_profile,
    wait_for_modal,
    click_save,
    take_screenshot,
)


def update_headline(page: Page, new_headline: str) -> dict:
    """Update the user's LinkedIn headline.

    Args:
        page: Authenticated Playwright page.
        new_headline: The new headline text.

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    # Click the edit (pencil) button on the intro card
    # LinkedIn's intro edit button is usually the first edit icon on the profile
    edit_btn = page.locator(
        'button[aria-label*="Edit intro"], '
        'button[aria-label*="edit intro"], '
        'section.pv-top-card button[aria-label*="Edit"]'
    ).first
    edit_btn.wait_for(state="visible", timeout=10000)
    edit_btn.click()
    page.wait_for_timeout(1500)

    modal = wait_for_modal(page)

    # Find and update the headline field
    headline_input = modal.locator(
        'input[id*="headline"], '
        'input[aria-label*="Headline"], '
        'input[name*="headline"]'
    ).first

    if headline_input.count() == 0:
        # Try finding by label text
        label = modal.locator('label:has-text("Headline")').first
        if label.count() > 0:
            field_id = label.get_attribute("for")
            if field_id:
                headline_input = modal.locator(f"#{field_id}")

    if headline_input.count() == 0:
        screenshot_path = take_screenshot(page, "headline_field_not_found")
        return {
            "status": "error",
            "message": "Could not find headline input field",
            "screenshot": screenshot_path,
        }

    # Clear and fill the headline
    headline_input.click()
    headline_input.fill("")
    headline_input.fill(new_headline)
    page.wait_for_timeout(500)

    # Save
    click_save(page, modal)

    return {
        "status": "success",
        "message": f"Headline updated to: {new_headline}",
        "section": "headline",
    }
