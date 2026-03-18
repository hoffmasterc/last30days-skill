#!/usr/bin/env python3
"""LinkedIn Profile Auto-Update Agent.

CLI tool and orchestrator for updating LinkedIn profile sections
via Playwright browser automation.

Usage:
    python3 linkedin_agent.py login
    python3 linkedin_agent.py logout
    python3 linkedin_agent.py update --section headline --value "Senior Engineer"
    python3 linkedin_agent.py update --section about --value "I build things..."
    python3 linkedin_agent.py update --section experience --action add --data '{"title": "Staff Engineer", "company": "Google", ...}'
    python3 linkedin_agent.py update --section education --action add --data '{"school": "MIT", ...}'
    python3 linkedin_agent.py update --section skills --action add --value "Python"
    python3 linkedin_agent.py update --section skills --action remove --value "Java"
    python3 linkedin_agent.py update --section certifications --action add --data '{"name": "AWS SA", ...}'
    python3 linkedin_agent.py screenshot
"""

import argparse
import json
import sys
import traceback

from .browser import open_session, clear_session, has_saved_session
from .profile import go_to_profile, take_screenshot
from .sections.headline import update_headline
from .sections.about import update_about
from .sections.experience import add_experience, edit_experience
from .sections.education import add_education, edit_education
from .sections.skills import add_skill, remove_skill
from .sections.certifications import add_certification


def cmd_login(args):
    """Interactive login to LinkedIn."""
    pw, ctx = open_session(force_login=True)
    print("Login successful! Session saved for future use.")
    ctx.browser.close()
    pw.stop()


def cmd_logout(args):
    """Clear saved LinkedIn session."""
    clear_session()
    print("LinkedIn session cleared.")


def cmd_status(args):
    """Check if a saved session exists and is valid."""
    if not has_saved_session():
        print("No saved session. Run 'login' to authenticate.")
        return

    pw, ctx = open_session()
    page = ctx.new_page()
    go_to_profile(page)
    print(f"Session is valid. Profile URL: {page.url}")
    page.close()
    ctx.browser.close()
    pw.stop()


def cmd_screenshot(args):
    """Take a screenshot of the profile page."""
    pw, ctx = open_session()
    page = ctx.new_page()
    go_to_profile(page)
    path = take_screenshot(page, args.name if hasattr(args, "name") and args.name else "profile")
    print(f"Screenshot saved: {path}")
    page.close()
    ctx.browser.close()
    pw.stop()


def cmd_update(args):
    """Update a profile section."""
    section = args.section.lower()
    action = getattr(args, "action", None) or "update"
    value = getattr(args, "value", None)
    data_str = getattr(args, "data", None)
    match_str = getattr(args, "match", None)

    data = {}
    if data_str:
        data = json.loads(data_str)

    pw, ctx = open_session()
    page = ctx.new_page()

    try:
        result = _dispatch_update(page, section, action, value, data, match_str)
        print(json.dumps(result, indent=2))
    except Exception as e:
        # Take a debug screenshot on error
        screenshot_path = take_screenshot(page, f"error_{section}")
        print(json.dumps({
            "status": "error",
            "message": str(e),
            "screenshot": screenshot_path,
            "traceback": traceback.format_exc(),
        }, indent=2))
    finally:
        page.close()
        ctx.browser.close()
        pw.stop()


def _dispatch_update(page, section, action, value, data, match_str):
    """Route the update command to the appropriate section handler."""
    if section == "headline":
        if not value:
            return {"status": "error", "message": "Headline requires --value"}
        return update_headline(page, value)

    elif section == "about":
        if not value:
            return {"status": "error", "message": "About requires --value"}
        return update_about(page, value)

    elif section == "experience":
        if action == "add":
            if not data:
                return {"status": "error", "message": "Experience add requires --data with JSON"}
            return add_experience(page, data)
        elif action == "edit":
            if not match_str:
                return {"status": "error", "message": "Experience edit requires --match to identify the entry"}
            return edit_experience(page, match_str, data)
        else:
            return {"status": "error", "message": f"Unknown experience action: {action}. Use 'add' or 'edit'."}

    elif section == "education":
        if action == "add":
            if not data:
                return {"status": "error", "message": "Education add requires --data with JSON"}
            return add_education(page, data)
        elif action == "edit":
            if not match_str:
                return {"status": "error", "message": "Education edit requires --match to identify the entry"}
            return edit_education(page, match_str, data)
        else:
            return {"status": "error", "message": f"Unknown education action: {action}. Use 'add' or 'edit'."}

    elif section == "skills":
        if not value:
            return {"status": "error", "message": "Skills requires --value with the skill name"}
        if action == "add":
            return add_skill(page, value)
        elif action == "remove":
            return remove_skill(page, value)
        else:
            return {"status": "error", "message": f"Unknown skills action: {action}. Use 'add' or 'remove'."}

    elif section in ("certifications", "certification", "licenses"):
        if action == "add":
            if not data:
                return {"status": "error", "message": "Certification add requires --data with JSON"}
            return add_certification(page, data)
        else:
            return {"status": "error", "message": f"Unknown certifications action: {action}. Use 'add'."}

    else:
        return {
            "status": "error",
            "message": f"Unknown section: {section}. Supported: headline, about, experience, education, skills, certifications",
        }


def main():
    parser = argparse.ArgumentParser(
        description="LinkedIn Profile Auto-Update Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s login                                    # Log in to LinkedIn
  %(prog)s logout                                   # Clear saved session
  %(prog)s status                                   # Check session validity
  %(prog)s screenshot                               # Take profile screenshot

  %(prog)s update --section headline --value "Senior Software Engineer"
  %(prog)s update --section about --value "I build distributed systems..."
  %(prog)s update --section experience --action add --data '{"title": "Staff Engineer", "company": "Google", "current": true, "start_month": "January", "start_year": "2024", "description": "Leading platform team"}'
  %(prog)s update --section experience --action edit --match "Google" --data '{"title": "Principal Engineer"}'
  %(prog)s update --section education --action add --data '{"school": "MIT", "degree": "Master of Science", "field_of_study": "Computer Science", "start_year": "2016", "end_year": "2018"}'
  %(prog)s update --section skills --action add --value "Kubernetes"
  %(prog)s update --section skills --action remove --value "Java"
  %(prog)s update --section certifications --action add --data '{"name": "AWS Solutions Architect", "issuing_org": "Amazon Web Services", "issue_month": "March", "issue_year": "2024", "no_expiry": true}'
        """,
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    # login
    subparsers.add_parser("login", help="Log in to LinkedIn interactively")

    # logout
    subparsers.add_parser("logout", help="Clear saved LinkedIn session")

    # status
    subparsers.add_parser("status", help="Check session status")

    # screenshot
    ss_parser = subparsers.add_parser("screenshot", help="Take a profile screenshot")
    ss_parser.add_argument("--name", default="profile", help="Screenshot file name")

    # update
    update_parser = subparsers.add_parser("update", help="Update a profile section")
    update_parser.add_argument(
        "--section", required=True,
        choices=["headline", "about", "experience", "education", "skills", "certifications"],
        help="Profile section to update",
    )
    update_parser.add_argument("--action", default="update", help="Action: add, edit, remove, update")
    update_parser.add_argument("--value", help="Simple text value (for headline, about, skills)")
    update_parser.add_argument("--data", help="JSON object with structured data (for experience, education, certifications)")
    update_parser.add_argument("--match", help="Text to match an existing entry (for edit actions)")

    args = parser.parse_args()

    commands = {
        "login": cmd_login,
        "logout": cmd_logout,
        "status": cmd_status,
        "screenshot": cmd_screenshot,
        "update": cmd_update,
    }

    commands[args.command](args)


if __name__ == "__main__":
    main()
