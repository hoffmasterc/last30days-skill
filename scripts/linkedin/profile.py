"""Profile page navigation and common interaction helpers.

Provides utilities for navigating to profile sections, clicking edit buttons,
waiting for modals, and interacting with LinkedIn's dynamic UI elements.
"""

import time
from playwright.sync_api import Page, Locator, TimeoutError as PlaywrightTimeout


PROFILE_URL = "https://www.linkedin.com/in/me/"


def go_to_profile(page: Page):
    """Navigate to the user's own LinkedIn profile page."""
    page.goto(PROFILE_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(2000)
    # Wait for the profile content to load
    page.wait_for_selector("main", timeout=10000)


def scroll_to_section(page: Page, section_id: str):
    """Scroll to a named section on the profile page.

    LinkedIn uses `id` attributes on section containers, e.g.:
    - "about" for the About section
    - "experience" for Experience
    - "education" for Education
    - "skills" for Skills
    - "licenses_and_certifications" for Certifications

    Falls back to heading text search if id-based lookup fails.
    """
    # Try by section id first
    section = page.locator(f"section#{section_id}").first
    if section.count() > 0:
        section.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        return section

    # Try by aria-label containing the section name
    section = page.locator(f'section[id*="{section_id}"]').first
    if section.count() > 0:
        section.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        return section

    # Fallback: search by heading text
    heading_map = {
        "about": "About",
        "experience": "Experience",
        "education": "Education",
        "skills": "Skills",
        "licenses_and_certifications": "Licenses & certifications",
        "certifications": "Licenses & certifications",
    }
    heading_text = heading_map.get(section_id, section_id.replace("_", " ").title())
    heading = page.locator(f"h2:has-text('{heading_text}'), div.pvs-header__title:has-text('{heading_text}')").first
    if heading.count() > 0:
        heading.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        # Return the parent section
        return heading.locator("xpath=ancestor::section").first

    return None


def click_edit_button(page: Page, section: Locator = None, aria_label: str = None):
    """Click an edit (pencil) button within a section or by aria-label.

    Args:
        page: The current page.
        section: Locator for the section containing the edit button.
        aria_label: Specific aria-label for the button.
    """
    if aria_label:
        btn = page.locator(f'button[aria-label*="{aria_label}"]').first
    elif section:
        btn = section.locator('button[aria-label*="Edit"]').first
    else:
        raise ValueError("Must provide either section or aria_label")

    btn.wait_for(state="visible", timeout=5000)
    btn.click()
    page.wait_for_timeout(1000)


def click_add_button(page: Page, section: Locator = None, aria_label: str = None):
    """Click an add (+) button within a section.

    Args:
        page: The current page.
        section: Locator for the section containing the add button.
        aria_label: Specific aria-label for the button.
    """
    if aria_label:
        btn = page.locator(f'button[aria-label*="{aria_label}"]').first
    elif section:
        # LinkedIn add buttons often have "Add" in the aria-label
        btn = section.locator('button[aria-label*="Add"]').first
    else:
        raise ValueError("Must provide either section or aria_label")

    btn.wait_for(state="visible", timeout=5000)
    btn.click()
    page.wait_for_timeout(1000)


def wait_for_modal(page: Page, timeout: int = 10000) -> Locator:
    """Wait for a LinkedIn modal dialog to appear.

    Returns:
        Locator for the modal element.
    """
    modal = page.locator('div[role="dialog"], div.artdeco-modal').first
    modal.wait_for(state="visible", timeout=timeout)
    page.wait_for_timeout(500)
    return modal


def close_modal(page: Page):
    """Close the currently open modal."""
    close_btn = page.locator(
        'button[aria-label="Dismiss"], '
        'button[aria-label="Close"], '
        'button.artdeco-modal__dismiss'
    ).first
    if close_btn.count() > 0:
        close_btn.click()
        page.wait_for_timeout(500)


def click_save(page: Page, modal: Locator = None):
    """Click the Save button in a modal or form.

    Args:
        page: The current page.
        modal: Optional modal locator to scope the search.
    """
    container = modal if modal else page
    save_btn = container.locator(
        'button:has-text("Save"), '
        'button[aria-label*="Save"]'
    ).first
    save_btn.wait_for(state="visible", timeout=5000)
    save_btn.click()
    page.wait_for_timeout(2000)


def fill_field(page: Page, label: str, value: str, modal: Locator = None):
    """Fill a form field by its label text.

    Handles both regular input fields and textareas.

    Args:
        page: The current page.
        label: The label text of the field.
        value: The value to fill in.
        modal: Optional modal to scope the search.
    """
    container = modal if modal else page

    # Try to find input by associated label
    field = container.locator(f'label:has-text("{label}")').first
    if field.count() > 0:
        # Get the input associated with this label
        field_id = field.get_attribute("for")
        if field_id:
            input_el = container.locator(f"#{field_id}")
        else:
            # Try sibling/child input
            input_el = field.locator("xpath=following::input[1] | following::textarea[1]")

        input_el.click()
        input_el.fill("")  # Clear first
        input_el.fill(value)
        page.wait_for_timeout(300)
        return

    # Fallback: try placeholder or aria-label
    input_el = container.locator(
        f'input[placeholder*="{label}"], '
        f'textarea[placeholder*="{label}"], '
        f'input[aria-label*="{label}"], '
        f'textarea[aria-label*="{label}"]'
    ).first
    if input_el.count() > 0:
        input_el.click()
        input_el.fill("")
        input_el.fill(value)
        page.wait_for_timeout(300)
        return

    raise ValueError(f"Could not find field with label: {label}")


def select_dropdown(page: Page, label: str, value: str, modal: Locator = None):
    """Select a value from a dropdown by label.

    LinkedIn uses custom dropdowns (not native <select>), so this handles
    both native selects and artdeco-style dropdowns.

    Args:
        page: The current page.
        label: The label text of the dropdown.
        value: The option text to select.
        modal: Optional modal to scope the search.
    """
    container = modal if modal else page

    # Try native select first
    select = container.locator(f'label:has-text("{label}") + select, label:has-text("{label}") ~ select').first
    if select.count() > 0:
        select.select_option(label=value)
        page.wait_for_timeout(300)
        return

    # Try artdeco dropdown
    dropdown_trigger = container.locator(f'label:has-text("{label}")').first
    if dropdown_trigger.count() > 0:
        # Find the associated dropdown button/select
        field_id = dropdown_trigger.get_attribute("for")
        if field_id:
            dropdown = container.locator(f"#{field_id}")
            dropdown.click()
            page.wait_for_timeout(500)

            # Select the option from the dropdown list
            option = page.locator(f'div[role="option"]:has-text("{value}"), li:has-text("{value}")').first
            if option.count() > 0:
                option.click()
                page.wait_for_timeout(300)
                return

    # Fallback: try select element with aria-label
    select = container.locator(f'select[aria-label*="{label}"]').first
    if select.count() > 0:
        select.select_option(label=value)
        page.wait_for_timeout(300)
        return

    raise ValueError(f"Could not find dropdown with label: {label}")


def take_screenshot(page: Page, name: str = "debug") -> str:
    """Take a debug screenshot and return the file path."""
    from pathlib import Path
    screenshot_dir = Path.home() / ".config" / "linkedin-agent" / "screenshots"
    screenshot_dir.mkdir(parents=True, exist_ok=True)
    path = screenshot_dir / f"{name}.png"
    page.screenshot(path=str(path))
    return str(path)
