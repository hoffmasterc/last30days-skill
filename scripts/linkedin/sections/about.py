"""Update LinkedIn profile About/Summary section."""

from playwright.sync_api import Page
from ..profile import (
    go_to_profile,
    scroll_to_section,
    click_edit_button,
    click_add_button,
    wait_for_modal,
    click_save,
    take_screenshot,
)


def update_about(page: Page, new_about: str) -> dict:
    """Update the user's LinkedIn About/Summary section.

    If the About section doesn't exist yet, this will add it.

    Args:
        page: Authenticated Playwright page.
        new_about: The new About/Summary text.

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "about")

    if section and section.count() > 0:
        # Edit existing About section
        try:
            click_edit_button(page, section)
        except Exception:
            # Try the pencil icon with specific aria-label
            try:
                edit_btn = page.locator(
                    'button[aria-label*="Edit about"], '
                    'button[aria-label*="Edit About"]'
                ).first
                edit_btn.click()
                page.wait_for_timeout(1000)
            except Exception:
                screenshot_path = take_screenshot(page, "about_edit_not_found")
                return {
                    "status": "error",
                    "message": "Could not find About section edit button",
                    "screenshot": screenshot_path,
                }
    else:
        # No About section exists - need to add one
        # Click "Add profile section" button
        add_section_btn = page.locator(
            'button:has-text("Add profile section"), '
            'button[aria-label*="Add profile section"]'
        ).first
        if add_section_btn.count() == 0:
            return {
                "status": "error",
                "message": "Could not find 'Add profile section' button",
            }
        add_section_btn.click()
        page.wait_for_timeout(1000)

        # Click "About" in the dropdown
        about_option = page.locator(
            'button:has-text("About"), '
            'li:has-text("About"), '
            'a:has-text("About")'
        ).first
        about_option.click()
        page.wait_for_timeout(1000)

    modal = wait_for_modal(page)

    # Find the About textarea
    about_textarea = modal.locator(
        'textarea[id*="about"], '
        'textarea[aria-label*="About"], '
        'textarea[aria-label*="Summary"], '
        'textarea[name*="summary"], '
        'div[role="textbox"]'
    ).first

    if about_textarea.count() == 0:
        # Try finding any textarea in the modal
        about_textarea = modal.locator("textarea").first

    if about_textarea.count() == 0:
        screenshot_path = take_screenshot(page, "about_textarea_not_found")
        return {
            "status": "error",
            "message": "Could not find About text field",
            "screenshot": screenshot_path,
        }

    # Clear and fill
    about_textarea.click()
    about_textarea.fill("")
    about_textarea.fill(new_about)
    page.wait_for_timeout(500)

    click_save(page, modal)

    return {
        "status": "success",
        "message": "About section updated successfully",
        "section": "about",
        "content_length": len(new_about),
    }
