# Directus Block Collections Setup Guide

This document outlines how to set up the new block collections in your Directus CMS to work with the AstroWind-inspired components.

## New Block Collections

The following block collections have been added:

1. **Features Block** (`block_features`) - Grid of feature cards with icons
2. **Content Block** (`block_content`) - Content section with image and text  
3. **Steps Block** (`block_steps`) - Timeline or step-by-step process
4. **Stats Block** (`block_stats`) - Number statistics showcase
5. **Call to Action Block** (`block_call_to_action`) - Prominent CTA section

---

## 1. Features Block Setup

### Main Collection: `block_features`

**Collection Settings:**
- Collection Name: `block_features`
- Display Template: `{{headline}}`
- Icon: `star`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| headline | String | Input | No | Main headline for the section |
| tagline | String | Input | No | Smaller text above headline |
| description | Text | WYSIWYG | No | Optional description |
| features | O2M | List (M2M) | No | Relationship to `block_features_items` |
| date_created | Timestamp | Datetime | No | Auto-populated |
| user_created | User | Select Dropdown | No | Auto-populated |
| date_updated | Timestamp | Datetime | No | Auto-populated |
| user_updated | User | Select Dropdown | No | Auto-populated |

### Related Collection: `block_features_items`

**Collection Settings:**
- Collection Name: `block_features_items`
- Display Template: `{{title}}`
- Icon: `list`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| title | String | Input | Yes | Feature title |
| description | Text | WYSIWYG | No | Feature description |
| icon | String | Input | No | HTML icon code or emoji |
| features | M2O | Select Dropdown | No | Relationship back to `block_features` |
| sort | Integer | Input | No | For ordering items |

**Relationship Setup:**
- In `block_features`, create O2M relationship field `features` pointing to `block_features_items.features`
- In `block_features_items`, create M2O relationship field `features` pointing back to `block_features`

---

## 2. Content Block Setup

### Main Collection: `block_content`

**Collection Settings:**
- Collection Name: `block_content`
- Display Template: `{{headline}}`
- Icon: `article`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| headline | String | Input | No | Main headline |
| tagline | String | Input | No | Smaller text above headline |
| content | Text | WYSIWYG | No | Rich text content |
| image | File | Image | No | Image to display |
| image_position | String | Select Dropdown | No | Options: `left`, `right` (default: `right`) |
| button | M2O | Select Dropdown | No | Relationship to `block_button` |
| date_created | Timestamp | Datetime | No | Auto-populated |
| user_created | User | Select Dropdown | No | Auto-populated |
| date_updated | Timestamp | Datetime | No | Auto-populated |
| user_updated | User | Select Dropdown | No | Auto-populated |

**Dropdown Options for `image_position`:**
- `left` - Image on Left
- `right` - Image on Right

---

## 3. Steps Block Setup

### Main Collection: `block_steps`

**Collection Settings:**
- Collection Name: `block_steps`
- Display Template: `{{headline}}`
- Icon: `format_list_numbered`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| headline | String | Input | No | Main headline |
| tagline | String | Input | No | Smaller text above headline |
| description | Text | WYSIWYG | No | Optional description |
| steps | O2M | List (M2M) | No | Relationship to `block_steps_items` |
| date_created | Timestamp | Datetime | No | Auto-populated |
| user_created | User | Select Dropdown | No | Auto-populated |
| date_updated | Timestamp | Datetime | No | Auto-populated |
| user_updated | User | Select Dropdown | No | Auto-populated |

### Related Collection: `block_steps_items`

**Collection Settings:**
- Collection Name: `block_steps_items`
- Display Template: `{{title}}`
- Icon: `list`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| title | String | Input | Yes | Step title |
| description | Text | WYSIWYG | No | Step description |
| icon | String | Input | No | HTML icon code or emoji |
| image | File | Image | No | Optional image for the step |
| steps | M2O | Select Dropdown | No | Relationship back to `block_steps` |
| sort | Integer | Input | No | For ordering steps |

**Relationship Setup:**
- In `block_steps`, create O2M relationship field `steps` pointing to `block_steps_items.steps`
- In `block_steps_items`, create M2O relationship field `steps` pointing back to `block_steps`

---

## 4. Stats Block Setup

### Main Collection: `block_stats`

**Collection Settings:**
- Collection Name: `block_stats`
- Display Template: `{{headline}}`
- Icon: `analytics`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| headline | String | Input | No | Main headline |
| tagline | String | Input | No | Smaller text above headline |
| stats | O2M | List (M2M) | No | Relationship to `block_stats_items` |
| date_created | Timestamp | Datetime | No | Auto-populated |
| user_created | User | Select Dropdown | No | Auto-populated |
| date_updated | Timestamp | Datetime | No | Auto-populated |
| user_updated | User | Select Dropdown | No | Auto-populated |

### Related Collection: `block_stats_items`

**Collection Settings:**
- Collection Name: `block_stats_items`
- Display Template: `{{number}} - {{label}}`
- Icon: `numbers`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| number | String | Input | Yes | The statistic (e.g., "1000+" or "95%") |
| label | String | Input | Yes | Label for the statistic |
| description | String | Input | No | Optional additional description |
| stats | M2O | Select Dropdown | No | Relationship back to `block_stats` |
| sort | Integer | Input | No | For ordering stats |

**Relationship Setup:**
- In `block_stats`, create O2M relationship field `stats` pointing to `block_stats_items.stats`
- In `block_stats_items`, create M2O relationship field `stats` pointing back to `block_stats`

---

## 5. Call to Action Block Setup

### Main Collection: `block_call_to_action`

**Collection Settings:**
- Collection Name: `block_call_to_action`
- Display Template: `{{headline}}`
- Icon: `campaign`

**Fields:**

| Field Name | Type | Interface | Required | Notes |
|------------|------|-----------|----------|-------|
| id | UUID | Primary Key | Yes | Auto-generated |
| headline | String | Input | No | Main headline |
| tagline | String | Input | No | Smaller text above headline |
| content | Text | WYSIWYG | No | Rich text content |
| button_group | M2O | Select Dropdown | No | Relationship to `block_button_group` |
| background_color | String | Select Dropdown | No | Options: `default`, `accent`, `muted` (default: `accent`) |
| date_created | Timestamp | Datetime | No | Auto-populated |
| user_created | User | Select Dropdown | No | Auto-populated |
| date_updated | Timestamp | Datetime | No | Auto-populated |
| user_updated | User | Select Dropdown | No | Auto-populated |

**Dropdown Options for `background_color`:**
- `default` - Default Background
- `accent` - Accent Color Background
- `muted` - Muted Background

---

## Adding Blocks to Pages

After creating these collections, you need to add them to the `page_blocks` junction table:

1. Go to **Settings** → **Data Model** → **page_blocks**
2. Edit the `collection` field
3. Add the following collections to the allowed list:
   - `block_features`
   - `block_content`
   - `block_steps`
   - `block_stats`
   - `block_call_to_action`

---

## Example Usage

### Features Block Example

```json
{
  "headline": "Why Choose Us",
  "tagline": "Our Features",
  "description": "Discover what makes us different",
  "features": [
    {
      "title": "Fast Performance",
      "description": "Lightning-fast load times",
      "icon": "⚡"
    },
    {
      "title": "Easy to Use",
      "description": "Intuitive interface for everyone",
      "icon": "🎯"
    }
  ]
}
```

### Content Block Example

```json
{
  "headline": "About Our Mission",
  "tagline": "Who We Are",
  "content": "<p>We are dedicated to...</p>",
  "image": "uuid-of-image-file",
  "image_position": "left",
  "button": {
    "label": "Learn More",
    "url": "/about"
  }
}
```

### Steps Block Example

```json
{
  "headline": "How It Works",
  "tagline": "Get Started",
  "steps": [
    {
      "title": "Sign Up",
      "description": "Create your free account",
      "icon": "1"
    },
    {
      "title": "Configure",
      "description": "Set up your preferences",
      "icon": "2"
    }
  ]
}
```

### Stats Block Example

```json
{
  "headline": "Our Impact",
  "tagline": "By The Numbers",
  "stats": [
    {
      "number": "10,000+",
      "label": "Happy Customers",
      "description": "And growing"
    },
    {
      "number": "95%",
      "label": "Satisfaction Rate"
    }
  ]
}
```

### Call to Action Example

```json
{
  "headline": "Ready to Get Started?",
  "tagline": "Join Us Today",
  "content": "<p>Don't wait any longer!</p>",
  "background_color": "accent",
  "button_group": {
    "buttons": [
      {
        "label": "Get Started",
        "url": "/signup",
        "style": "primary"
      }
    ]
  }
}
```

---

## TypeScript Types

All TypeScript interfaces have been added to `src/types/directus-schema.ts`:

- `BlockFeatures` & `BlockFeaturesItem`
- `BlockContent`
- `BlockSteps` & `BlockStepsItem`
- `BlockStats` & `BlockStatsItem`
- `BlockCallToAction`

---

## Frontend Components

The following React components have been created in `src/components/blocks/`:

- `Features.tsx` - Renders feature grid
- `Content.tsx` - Renders content with image
- `Steps.tsx` - Renders step-by-step process
- `Stats.tsx` - Renders statistics
- `CallToAction.tsx` - Renders CTA section

All components are automatically registered in `BaseBlock.tsx` and will render when added to a page through Directus.

---

## Notes

- All components support the Directus Visual Editing feature
- Components use the existing design system (Tailwind CSS classes)
- Dark mode is automatically supported through existing CSS variables
- All blocks are responsive and mobile-friendly

