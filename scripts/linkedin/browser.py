"""Browser and session management for LinkedIn automation.

Handles:
- Launching Playwright browser (headed for login, headless for operations)
- Saving and loading session state (cookies/storage)
- Login flow with interactive authentication
"""

import json
import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, Browser, BrowserContext, Page


SESSION_DIR = Path.home() / ".config" / "linkedin-agent"
SESSION_FILE = SESSION_DIR / "session.json"
LINKEDIN_URL = "https://www.linkedin.com"
LOGIN_URL = "https://www.linkedin.com/login"
FEED_URL = "https://www.linkedin.com/feed/"


def _ensure_session_dir():
    SESSION_DIR.mkdir(parents=True, exist_ok=True)


def has_saved_session() -> bool:
    """Check if a saved session exists."""
    return SESSION_FILE.exists()


def save_session(context: BrowserContext):
    """Save browser session state (cookies + localStorage) to disk."""
    _ensure_session_dir()
    state = context.storage_state()
    with open(SESSION_FILE, "w") as f:
        json.dump(state, f)


def clear_session():
    """Remove saved session file."""
    if SESSION_FILE.exists():
        SESSION_FILE.unlink()


def _is_logged_in(page: Page) -> bool:
    """Check if we're currently logged in to LinkedIn."""
    try:
        page.goto(FEED_URL, wait_until="domcontentloaded", timeout=15000)
        # If we end up on the feed page (not redirected to login), we're logged in
        page.wait_for_timeout(2000)
        current_url = page.url
        return "/feed" in current_url or "/in/" in current_url
    except Exception:
        return False


def login_interactive(playwright) -> BrowserContext:
    """Launch a headed browser for the user to log in manually.

    Opens LinkedIn login page, waits for user to complete login
    (including 2FA if needed), then saves the session.

    Returns:
        BrowserContext with authenticated session.
    """
    print("\n--- LinkedIn Login ---")
    print("A browser window will open. Please log in to your LinkedIn account.")
    print("Complete any 2FA/verification if prompted.")
    print("The agent will detect when you're logged in and continue automatically.\n")

    browser = playwright.chromium.launch(
        headless=False,
        args=["--disable-blink-features=AutomationControlled"],
    )
    context = browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent=(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
    )

    page = context.new_page()
    page.goto(LOGIN_URL, wait_until="domcontentloaded")

    # Wait for user to complete login - poll every 3 seconds
    print("Waiting for login to complete...")
    max_wait = 300  # 5 minutes
    elapsed = 0
    while elapsed < max_wait:
        time.sleep(3)
        elapsed += 3
        current_url = page.url
        if "/feed" in current_url or "/in/" in current_url:
            print("Login detected! Saving session...")
            save_session(context)
            return context

        # Also check if the page title indicates we're on the main page
        try:
            title = page.title().lower()
        except Exception:
            # Page may be navigating; skip this check and retry next iteration
            continue
        if "feed" in title or ("linkedin" in title and "login" not in title and "sign" not in title):
            # Double-check by trying to navigate to feed
            page.goto(FEED_URL, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            if "/feed" in page.url:
                print("Login detected! Saving session...")
                save_session(context)
                return context

    raise TimeoutError("Login timed out after 5 minutes. Please try again.")


def get_context(playwright, force_login: bool = False) -> BrowserContext:
    """Get an authenticated browser context.

    If a saved session exists and is valid, uses it (headless).
    Otherwise, launches interactive login.

    Args:
        playwright: Playwright instance.
        force_login: If True, ignore saved session and re-login.

    Returns:
        Authenticated BrowserContext.
    """
    if not force_login and has_saved_session():
        # Try to reuse saved session
        browser = playwright.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = browser.new_context(
            storage_state=str(SESSION_FILE),
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        )
        page = context.new_page()

        if _is_logged_in(page):
            print("Resumed saved LinkedIn session.")
            page.close()
            return context
        else:
            print("Saved session expired. Re-authenticating...")
            browser.close()
            clear_session()

    # Interactive login needed
    return login_interactive(playwright)


def open_session(force_login: bool = False):
    """Context manager-style helper that returns (playwright, context).

    Usage:
        pw, ctx = open_session()
        page = ctx.new_page()
        # ... do stuff ...
        ctx.browser.close()
        pw.stop()
    """
    pw = sync_playwright().start()
    ctx = get_context(pw, force_login=force_login)
    return pw, ctx
