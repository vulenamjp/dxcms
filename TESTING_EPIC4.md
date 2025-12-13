# Testing Guide - Admin Page Builder

## Prerequisites

1. **Database running**: Ensure PostgreSQL (Neon) is accessible
2. **Seed data loaded**: Run `npx prisma db seed` if not already done
3. **Environment variables**: `.env` file configured with `DATABASE_URL` and `JWT_SECRET`

## Testing Workflow

### 1. Start the Application

```bash
npm run dev
```

Server should start at `http://localhost:3000`

### 2. Login to Admin Panel

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. Click "Sign in"
4. Should redirect to `/admin` dashboard

**Expected Result**: ✅ Login successful, see admin dashboard

### 3. View Pages List

1. Click "Pages" in navigation or go to `/admin/pages`
2. Should see table with columns: Title, Slug, Status, Author, Updated, Actions

**Expected Results**:
- ✅ Empty state message if no pages
- ✅ Existing pages displayed in table
- ✅ Status badges color-coded (Draft=gray, Published=green, Archived=yellow)
- ✅ "Create Page" button visible

### 4. Create a New Page

#### 4.1 Basic Information

1. Click "Create Page" button
2. Fill in form:
   - **Title**: `About Us`
   - **Slug**: `about-us` (auto-lowercase)
   - **Status**: Keep as "Draft"
   - **SEO Title**: `About Our Company` (shows 17/60)
   - **SEO Description**: `Learn about our mission, values, and team` (shows 42/160)

**Expected Results**:
- ✅ Slug converts to lowercase automatically
- ✅ Character counters update in real-time
- ✅ No blocks section shows "No blocks added yet"

#### 4.2 Add Hero Block

1. Click "+ Add Block"
2. Select "🎯 Hero"
3. Block appears with edit mode active
4. Fill in:
   - **Title**: `Welcome to Our Company`
   - **Subtitle**: `Building the future together`
   - **CTA Text**: `Learn More`
   - **CTA Link**: `/services`
   - **Alignment**: `Center`
   - **Height**: `Large`
   - **Background Image URL**: `https://images.unsplash.com/photo-1497366216548-37526070297c`
5. Click "Done"

**Expected Results**:
- ✅ Block added with unique ID
- ✅ Edit mode opens automatically
- ✅ All fields editable
- ✅ Block collapses after clicking "Done"

#### 4.3 Add Services Block

1. Click "+ Add Block" again
2. Select "⚙️ Services"
3. Edit:
   - **Title**: `Our Services`
   - **Limit**: `6`
   - **Display Style**: `Grid`
   - **Columns**: `3`
   - **Show Icons**: ✓ (checked)
   - **Show Descriptions**: ✓ (checked)
4. Click "Done"

**Expected Results**:
- ✅ Second block added below hero
- ✅ Each block has drag handle visible
- ✅ Edit/Remove buttons present

#### 4.4 Add Rich Text Block

1. Add "📝 Rich Text" block
2. Edit:
   - **Format**: `HTML`
   - **Content**:
```html
<h2>Who We Are</h2>
<p>We are a leading company in the industry, dedicated to providing exceptional services to our clients worldwide.</p>
<p>Founded in 2020, we have grown to become a trusted name in our field.</p>
```
3. Click "Done"

**Expected Results**:
- ✅ Textarea shows HTML code
- ✅ Format selector works (HTML/Markdown)
- ✅ Content saved

#### 4.5 Add Contact Block

1. Add "📧 Contact" block
2. Edit:
   - **Title**: `Get in Touch`
   - **Description**: `We'd love to hear from you`
   - **CTA Text**: `Contact Us`
   - **CTA Link**: `/contact`
   - **Show Email**: ✓
   - **Show Phone**: ✓
   - **Show Address**: ✗
   - **Email**: `info@company.com`
   - **Phone**: `+1 (555) 123-4567`
3. Click "Done"

**Expected Results**:
- ✅ Conditional fields appear when checkboxes checked
- ✅ Email and Phone fields visible
- ✅ Address field hidden

#### 4.6 Test Drag & Drop

1. Hover over Rich Text block
2. Grab the drag handle (⋮⋮ icon)
3. Drag it above Services block
4. Release

**Expected Results**:
- ✅ Visual feedback during drag (opacity change)
- ✅ Block moves to new position
- ✅ Order: Hero → Rich Text → Services → Contact
- ✅ All blocks maintain their data

#### 4.7 Test Block Removal

1. Click "Remove" on Contact block
2. Confirm in dialog

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ Block removed after confirmation
- ✅ Remaining blocks: Hero, Rich Text, Services

#### 4.8 Save Page

1. Scroll to bottom
2. Click "Create Page" button

**Expected Results**:
- ✅ Button shows "Saving..." state
- ✅ Redirects to `/admin/pages` after success
- ✅ New page appears in table
- ✅ Success feedback visible

### 5. Edit Existing Page

1. In pages list, click "Edit" on "About Us" page
2. Form loads with existing data

**Expected Results**:
- ✅ All fields populated correctly
- ✅ All blocks displayed
- ✅ Block order preserved

#### 5.1 Modify Page

1. Change **Title** to `About Our Company`
2. Change **Status** to `Published`
3. Edit Hero block:
   - Change **Height** to `Medium`
4. Add new block: "📰 News"
   - **Title**: `Latest Updates`
   - **Limit**: `3`
   - **Display Style**: `Featured`
5. Click "Update Page"

**Expected Results**:
- ✅ Changes saved
- ✅ Redirects to pages list
- ✅ Status badge now shows "PUBLISHED" (green)
- ✅ Table refreshes with new data

### 6. View Public Page

1. In pages list, click "View" on "About Our Company"
2. Opens in new tab

**Expected Result**: 
- ⚠️ Shows 404 (public rendering not implemented yet - EPIC 6)
- This is expected behavior at this stage

### 7. Test Form Validation

#### 7.1 Invalid Slug

1. Create new page
2. Enter slug: `About Us` (with spaces and uppercase)
3. Try to submit

**Expected Result**: ✅ Browser validation prevents submit (pattern mismatch)

#### 7.2 Empty Required Fields

1. Create new page
2. Leave title empty
3. Try to submit

**Expected Result**: ✅ Browser shows "Please fill out this field"

#### 7.3 SEO Limits

1. Enter SEO title with 100 characters
2. Character counter shows red/warning

**Expected Result**: ✅ Counter updates, form allows submit (validation at API level)

### 8. Test Logout

1. Click "Logout" in header
2. Confirm logout

**Expected Results**:
- ✅ Redirects to login page
- ✅ Session cleared
- ✅ Cannot access `/admin` routes without re-login

### 9. Test All Block Types

Create a test page with all 7 block types:

#### 9.1 Projects Block
```
Title: Our Portfolio
Limit: 6
Display Style: Masonry
Columns: 3
Show Description: ✓
```

#### 9.2 News Block
```
Title: Latest News
Limit: 4
Display Style: Grid
Columns: 2
Show Excerpt: ✓
Show Image: ✓
Show Date: ✓
```

#### 9.3 Gallery Block
```
Title: Photo Gallery
Display Style: Grid
Columns: 4
Show Captions: ✓
Lightbox: ✓
```

**Expected Result**: ✅ All block editors work correctly

### 10. Edge Cases

#### 10.1 Duplicate Slugs

1. Create page with slug `test`
2. Try creating another page with slug `test`
3. Submit

**Expected Result**: ✅ API returns error (unique constraint violation)

#### 10.2 Maximum Blocks

1. Add 20+ blocks to a page
2. Test drag & drop performance

**Expected Result**: ✅ No performance issues, smooth dragging

#### 10.3 Browser Back Button

1. Start creating a page
2. Add blocks
3. Click browser back

**Expected Result**: ⚠️ Data lost (no auto-save yet), user warned

## API Testing (Optional)

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# Get pages
curl http://localhost:3000/api/admin/pages -b cookies.txt

# Create page
curl -X POST http://localhost:3000/api/admin/pages \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "slug": "test-page",
    "title": "Test Page",
    "status": "DRAFT",
    "body": {
      "version": 1,
      "seo": {
        "title": "Test",
        "description": "Test description",
        "ogType": "website"
      },
      "blocks": [
        {
          "id": "hero-1",
          "type": "hero",
          "data": {
            "title": "Test Hero",
            "alignment": "center",
            "height": "medium"
          }
        }
      ]
    }
  }'
```

## Accessibility Testing

1. **Keyboard navigation**:
   - Tab through form fields
   - Use Enter to submit
   - Use Escape to close menus

2. **Screen reader**:
   - Test with VoiceOver (Mac) or NVDA (Windows)
   - Verify labels are announced
   - Check form validation messages

3. **Focus indicators**:
   - All interactive elements should show focus ring

## Performance Testing

1. **Page load time**: < 1 second for admin pages
2. **Form submission**: < 500ms
3. **Drag & drop**: Smooth 60fps animation
4. **Large pages**: 50+ blocks should load without lag

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Mobile Testing (Responsive)

1. Open in mobile browser or device mode
2. Test form inputs
3. Test block add/edit (should work but drag may be limited)

**Expected**: ✅ Responsive layout, all features accessible

## Summary Checklist

- [ ] Login/logout works
- [ ] Pages list displays correctly
- [ ] Create page form works
- [ ] All 7 block types can be added
- [ ] Block editors save data correctly
- [ ] Drag & drop reordering works
- [ ] Edit page loads existing data
- [ ] Update page saves changes
- [ ] Form validation prevents invalid data
- [ ] Status badges display correctly
- [ ] SEO character counters work
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Keyboard accessible

## Known Issues / Limitations

1. **No auto-save**: Changes lost on browser back/refresh
2. **No preview**: Can't preview page before publishing (EPIC 9)
3. **Gallery images**: Need media library (EPIC 7)
4. **Undo/redo**: Not implemented
5. **Block templates**: Not available yet

## Next Steps

After successful testing:
- ✅ EPIC 4 complete
- → Proceed to EPIC 5: Enhanced Block Editors
- → Then EPIC 6: Public Page Rendering

## Support

If you encounter issues:
1. Check console for errors
2. Verify database connection
3. Check API responses in Network tab
4. Review [EPIC4_README.md](./EPIC4_README.md)
