# Bug Fix Plan: Mobile Camera Integration

## Objective
Enable mobile users to directly open the camera to take and upload photos for evidence, in addition to the existing gallery upload option.

## Analysis
- **Current State**: The `IssueDetailsStep.tsx` component uses a single file input:
  ```tsx
  <input type="file" multiple accept="image/*" />
  ```
  This typically opens a system dialog allowing choice between Camera and Files on mobile, but lacks a direct "Camera" call-to-action.
- **Requirement**: The user wants an explicit option to open the camera directly when using a mobile device.

## Proposed Changes
1.  **Modify `src/app/survey/components/IssueDetailsStep.tsx`**:
    - Add a new "Take Photo" (ถ่ายรูป) button next to the existing "Select Files" area.
    - Implement a hidden file input specifically for the camera:
      ```tsx
      <input
        type="file"
        accept="image/*"
        capture="environment" // Forces rear camera on mobile
        className="hidden"
        onChange={...}
      />
      ```
    - Ensure the `onChange` handler for this new input appends the captured photo to the `formData.imageUrls` and `formData.imageCaptions` arrays, similar to the existing implementation.

## Implementation Steps
1.  **Update UI**:
    - Add a secondary button or a distinct clickable area within the upload section for "Take Photo".
    - Use a camera icon (e.g., `camera_alt` from Material Icons) to indicate functionality.
2.  **Handle Camera Input**:
    - Create a ref for the camera input to trigger it programmatically when the button is clicked.
    - Process the file from the camera input ensuring it's added to `selectedFiles` and previews are generated.
3.  **Verify**:
    - Ensure the existing "Click to upload" still works for multiple file selection from the gallery.
    - Verify the new button triggers the camera directly on mobile devices (or file picker with camera option on desktop).

## File Structure
- `src/app/survey/components/IssueDetailsStep.tsx`
