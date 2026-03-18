"""Add and remove LinkedIn Skills."""

from playwright.sync_api import Page
from ..profile import (
    go_to_profile,
    scroll_to_section,
    click_add_button,
    wait_for_modal,
    click_save,
    take_screenshot,
)


def add_skill(page: Page, skill_name: str) -> dict:
    """Add a skill to the profile.

    Args:
        page: Authenticated Playwright page.
        skill_name: Name of the skill to add (e.g. "Python", "Machine Learning").

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "skills")

    if section and section.count() > 0:
        try:
            click_add_button(page, section)
        except Exception:
            add_btn = page.locator(
                'button[aria-label*="Add skill"], '
                'button[aria-label*="add skill"]'
            ).first
            if add_btn.count() > 0:
                add_btn.click()
                page.wait_for_timeout(1000)
            else:
                # Try the "Add new skill" link/button
                add_btn = page.locator('button:has-text("Add skill")').first
                if add_btn.count() > 0:
                    add_btn.click()
                    page.wait_for_timeout(1000)
                else:
                    screenshot_path = take_screenshot(page, "skill_add_not_found")
                    return {
                        "status": "error",
                        "message": "Could not find add skill button",
                        "screenshot": screenshot_path,
                    }
    else:
        # Use "Add profile section"
        add_btn = page.locator('button:has-text("Add profile section")').first
        if add_btn.count() > 0:
            add_btn.click()
            page.wait_for_timeout(1000)
            skill_option = page.locator(
                'button:has-text("Add skill"), '
                'li:has-text("Skill")'
            ).first
            if skill_option.count() > 0:
                skill_option.click()
                page.wait_for_timeout(1000)

    modal = wait_for_modal(page)

    # Find the skill input field
    skill_input = modal.locator(
        'input[aria-label*="Skill"], '
        'input[id*="skill"], '
        'input[placeholder*="skill"], '
        'input[placeholder*="Skill"]'
    ).first

    if skill_input.count() == 0:
        skill_input = modal.locator("input").first

    if skill_input.count() == 0:
        screenshot_path = take_screenshot(page, "skill_input_not_found")
        return {
            "status": "error",
            "message": "Could not find skill input field",
            "screenshot": screenshot_path,
        }

    skill_input.click()
    skill_input.fill(skill_name)
    page.wait_for_timeout(1000)

    # Try to select from autocomplete suggestions
    suggestion = page.locator(
        f'div[role="option"]:has-text("{skill_name}"), '
        f'li:has-text("{skill_name}")'
    ).first
    if suggestion.count() > 0:
        suggestion.click()
        page.wait_for_timeout(500)

    click_save(page, modal)

    return {
        "status": "success",
        "message": f"Added skill: {skill_name}",
        "section": "skills",
    }


def remove_skill(page: Page, skill_name: str) -> dict:
    """Remove a skill from the profile.

    Args:
        page: Authenticated Playwright page.
        skill_name: Name of the skill to remove.

    Returns:
        dict with status and details.
    """
    go_to_profile(page)

    section = scroll_to_section(page, "skills")
    if not section or section.count() == 0:
        return {
            "status": "error",
            "message": "No skills section found on profile",
        }

    # Click edit on the skills section
    edit_btn = section.locator('button[aria-label*="Edit"]').first
    if edit_btn.count() == 0:
        edit_btn = page.locator('button[aria-label*="Edit skill"]').first

    if edit_btn.count() == 0:
        return {
            "status": "error",
            "message": "Could not find skills edit button",
        }

    edit_btn.click()
    page.wait_for_timeout(1000)

    # Find and click delete on the specific skill
    skill_entry = page.locator(f'li:has-text("{skill_name}")').first
    if skill_entry.count() == 0:
        return {
            "status": "error",
            "message": f"Could not find skill: {skill_name}",
        }

    delete_btn = skill_entry.locator(
        'button[aria-label*="Delete"], '
        'button[aria-label*="Remove"]'
    ).first
    if delete_btn.count() > 0:
        delete_btn.click()
        page.wait_for_timeout(500)

        # Confirm deletion if prompted
        confirm_btn = page.locator(
            'button:has-text("Delete"), '
            'button:has-text("Remove"), '
            'button:has-text("Yes")'
        ).first
        if confirm_btn.count() > 0:
            confirm_btn.click()
            page.wait_for_timeout(1000)

    return {
        "status": "success",
        "message": f"Removed skill: {skill_name}",
        "section": "skills",
    }
