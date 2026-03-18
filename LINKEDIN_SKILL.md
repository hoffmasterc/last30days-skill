---
name: linkedin-update
description: Update your LinkedIn profile sections automatically via browser automation. Supports headline, about, experience, education, skills, and certifications.
argument-hint: "update my [section] to [content]" or "add [item] to my [section]"
context: fork
allowed-tools: Bash, Read, AskUserQuestion
---

# LinkedIn Profile Auto-Update Agent

Automatically update any section of a LinkedIn profile using browser automation (Playwright).

## Supported Sections

| Section | Actions | Example |
|---------|---------|---------|
| **Headline** | Update | "Change my headline to Senior Software Engineer at Google" |
| **About** | Update | "Update my about section to talk about my experience in AI" |
| **Experience** | Add, Edit | "Add a new role as Staff Engineer at Stripe starting Jan 2024" |
| **Education** | Add, Edit | "Add my Master's from Stanford in Computer Science 2018-2020" |
| **Skills** | Add, Remove | "Add Python, Kubernetes, and AWS to my skills" |
| **Certifications** | Add | "Add my AWS Solutions Architect certification" |

## How This Works

1. **First time**: The agent opens a browser for you to log in to LinkedIn manually (including 2FA)
2. **After login**: Your session is saved locally at `~/.config/linkedin-agent/session.json`
3. **Subsequent uses**: The agent reuses your saved session (no browser window needed)
4. **If session expires**: The agent automatically detects expiry and re-prompts for login

## Parse User Intent

When the user invokes this skill, parse their input for:

1. **SECTION**: Which profile section to update (headline, about, experience, education, skills, certifications)
2. **ACTION**: What to do (update, add, edit, remove)
3. **CONTENT**: The actual content to set

Common request patterns:
- "Update my headline to X" → section=headline, value=X
- "Change my about to X" → section=about, value=X
- "Add experience at Company as Title" → section=experience, action=add
- "Edit my Google experience" → section=experience, action=edit, match=Google
- "Add Python to my skills" → section=skills, action=add, value=Python
- "Remove Java from my skills" → section=skills, action=remove, value=Java
- "Add AWS certification" → section=certifications, action=add

## Execution Flow

### Step 1: Check Login Status

```bash
python3 -m scripts.linkedin status
```

If not logged in, run:
```bash
python3 -m scripts.linkedin login
```

**IMPORTANT**: The login command opens a headed browser. Tell the user to log in manually in the browser window that appears. Wait for them to confirm login is complete.

### Step 2: Execute the Update

Based on parsed intent, run the appropriate command:

**Headline:**
```bash
python3 -m scripts.linkedin update --section headline --value "The new headline text"
```

**About:**
```bash
python3 -m scripts.linkedin update --section about --value "The new about text. Can be multiple paragraphs."
```

**Experience (add):**
```bash
python3 -m scripts.linkedin update --section experience --action add --data '{"title": "Staff Engineer", "company": "Google", "employment_type": "Full-time", "location": "San Francisco, CA", "start_month": "January", "start_year": "2024", "current": true, "description": "Leading the platform engineering team..."}'
```

**Experience (edit):**
```bash
python3 -m scripts.linkedin update --section experience --action edit --match "Google" --data '{"title": "Principal Engineer", "description": "Updated description..."}'
```

**Education (add):**
```bash
python3 -m scripts.linkedin update --section education --action add --data '{"school": "Massachusetts Institute of Technology", "degree": "Master of Science", "field_of_study": "Computer Science", "start_year": "2016", "end_year": "2018", "description": "Focus on distributed systems and machine learning."}'
```

**Skills (add):**
```bash
python3 -m scripts.linkedin update --section skills --action add --value "Python"
```

**Skills (remove):**
```bash
python3 -m scripts.linkedin update --section skills --action remove --value "Java"
```

**Certifications (add):**
```bash
python3 -m scripts.linkedin update --section certifications --action add --data '{"name": "AWS Solutions Architect - Professional", "issuing_org": "Amazon Web Services", "issue_month": "March", "issue_year": "2024", "no_expiry": true, "credential_id": "ABC123"}'
```

### Step 3: Verify & Report

After each update command, parse the JSON output:
- If `status` is `"success"`: Report the update to the user
- If `status` is `"error"`: Check the `message` and `screenshot` fields
  - If a screenshot was taken, read it to understand what went wrong
  - Report the error and suggest next steps

### Step 4: Multiple Updates

If the user requests multiple updates at once (e.g., "Update my headline and add a new experience"), execute them sequentially. Report each result individually.

## Error Handling

- **Session expired**: Run `login` again
- **Element not found**: The agent takes a debug screenshot. Read it to diagnose. LinkedIn's UI changes frequently — selectors may need updating.
- **Rate limiting**: If LinkedIn shows a challenge/captcha, tell the user to complete it manually

## Taking Debug Screenshots

```bash
python3 -m scripts.linkedin screenshot --name debug
```

Screenshots are saved to `~/.config/linkedin-agent/screenshots/`.

## Important Notes

- Always confirm with the user BEFORE making changes to their profile
- For experience/education edits, show the user exactly what will be changed
- The agent runs headlessly after initial login — no browser window appears
- Session data is stored locally and never transmitted
- LinkedIn may require re-authentication periodically (sessions typically last 1-2 weeks)
