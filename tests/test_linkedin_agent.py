"""Tests for the LinkedIn agent CLI and orchestrator."""

import json
import unittest
from unittest.mock import patch, MagicMock


class TestDispatchUpdate(unittest.TestCase):
    """Test the _dispatch_update routing logic."""

    def setUp(self):
        self.mock_page = MagicMock()

    @patch("scripts.linkedin.linkedin_agent.update_headline")
    def test_headline_dispatch(self, mock_update):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        mock_update.return_value = {"status": "success", "message": "Headline updated"}
        result = _dispatch_update(self.mock_page, "headline", "update", "New Headline", {}, None)
        mock_update.assert_called_once_with(self.mock_page, "New Headline")
        self.assertEqual(result["status"], "success")

    def test_headline_requires_value(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "headline", "update", None, {}, None)
        self.assertEqual(result["status"], "error")
        self.assertIn("--value", result["message"])

    @patch("scripts.linkedin.linkedin_agent.update_about")
    def test_about_dispatch(self, mock_update):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        mock_update.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "about", "update", "New about text", {}, None)
        mock_update.assert_called_once_with(self.mock_page, "New about text")

    def test_about_requires_value(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "about", "update", None, {}, None)
        self.assertEqual(result["status"], "error")

    @patch("scripts.linkedin.linkedin_agent.add_experience")
    def test_experience_add_dispatch(self, mock_add):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        data = {"title": "Engineer", "company": "Acme"}
        mock_add.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "experience", "add", None, data, None)
        mock_add.assert_called_once_with(self.mock_page, data)

    def test_experience_add_requires_data(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "experience", "add", None, {}, None)
        self.assertEqual(result["status"], "error")

    @patch("scripts.linkedin.linkedin_agent.edit_experience")
    def test_experience_edit_dispatch(self, mock_edit):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        data = {"title": "Senior Engineer"}
        mock_edit.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "experience", "edit", None, data, "Google")
        mock_edit.assert_called_once_with(self.mock_page, "Google", data)

    def test_experience_edit_requires_match(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "experience", "edit", None, {}, None)
        self.assertEqual(result["status"], "error")
        self.assertIn("--match", result["message"])

    @patch("scripts.linkedin.linkedin_agent.add_skill")
    def test_skills_add_dispatch(self, mock_add):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        mock_add.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "skills", "add", "Python", {}, None)
        mock_add.assert_called_once_with(self.mock_page, "Python")

    @patch("scripts.linkedin.linkedin_agent.remove_skill")
    def test_skills_remove_dispatch(self, mock_remove):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        mock_remove.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "skills", "remove", "Java", {}, None)
        mock_remove.assert_called_once_with(self.mock_page, "Java")

    def test_skills_requires_value(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "skills", "add", None, {}, None)
        self.assertEqual(result["status"], "error")

    @patch("scripts.linkedin.linkedin_agent.add_certification")
    def test_certifications_dispatch(self, mock_add):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        data = {"name": "AWS SA", "issuing_org": "AWS"}
        mock_add.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "certifications", "add", None, data, None)
        mock_add.assert_called_once_with(self.mock_page, data)

    def test_unknown_section(self):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        result = _dispatch_update(self.mock_page, "unknown", "update", None, {}, None)
        self.assertEqual(result["status"], "error")
        self.assertIn("Unknown section", result["message"])

    @patch("scripts.linkedin.linkedin_agent.add_education")
    def test_education_add_dispatch(self, mock_add):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        data = {"school": "MIT", "degree": "MS"}
        mock_add.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "education", "add", None, data, None)
        mock_add.assert_called_once_with(self.mock_page, data)

    @patch("scripts.linkedin.linkedin_agent.edit_education")
    def test_education_edit_dispatch(self, mock_edit):
        from scripts.linkedin.linkedin_agent import _dispatch_update

        data = {"degree": "PhD"}
        mock_edit.return_value = {"status": "success"}
        result = _dispatch_update(self.mock_page, "education", "edit", None, data, "MIT")
        mock_edit.assert_called_once_with(self.mock_page, "MIT", data)


class TestBrowserModule(unittest.TestCase):
    """Test browser session management."""

    def test_session_dir_constant(self):
        from scripts.linkedin.browser import SESSION_DIR
        self.assertIn("linkedin-agent", str(SESSION_DIR))

    def test_has_saved_session_false_when_no_file(self):
        from scripts.linkedin.browser import has_saved_session, SESSION_FILE
        # Only test if file doesn't exist (don't create/delete real sessions)
        if not SESSION_FILE.exists():
            self.assertFalse(has_saved_session())


class TestProfileHelpers(unittest.TestCase):
    """Test profile navigation helpers."""

    def test_profile_url_constant(self):
        from scripts.linkedin.profile import PROFILE_URL
        self.assertEqual(PROFILE_URL, "https://www.linkedin.com/in/me/")


if __name__ == "__main__":
    unittest.main()
