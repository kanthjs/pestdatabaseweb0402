# Survey Form Components

This directory contains the modularized components for the pest report survey form.

## Architecture

The survey form follows a **multi-step wizard pattern** with the following structure:

```
survey/
├── components/
│   ├── types.ts              # Shared types and constants
│   ├── FormNavigation.tsx    # Navigation buttons (Back/Next/Submit)
│   ├── LocationStep.tsx      # Step 1: Location & GPS
│   ├── PlantSelectionStep.tsx # Step 2: Plant selection
│   ├── PestSelectionStep.tsx # Step 3: Pest selection
│   ├── IssueDetailsStep.tsx  # Step 4: Details & images
│   ├── ReporterStep.tsx      # Step 5: Reporter info
│   └── index.ts              # Barrel exports
├── SurveyFormClient.tsx      # Main container
├── loading.tsx               # Loading state
├── error.tsx                 # Error boundary
└── actions.ts                # Server actions
```

## Components

### `types.ts`
Shared TypeScript interfaces and constants used across all steps:
- `Province`, `Plant`, `Pest` - Entity types
- `PestReportFormData` - Form state interface
- `StepId` - Union type for step identifiers
- `REPORTER_ROLES` - Constants for role selection

### `FormNavigation.tsx`
Navigation controls for the multi-step form:
- Back button (hidden on first step)
- Next Step / Submit Report button
- Cancel button
- Handles loading states

### Step Components
Each step is self-contained with:
- Props interface accepting `formData` and `setFormData`
- Consistent CardHeader with icon, title, description
- Form inputs with proper validation
- Grid layout (responsive: mobile 1-col, desktop 2-col)

| Step | Component | Purpose |
|------|-----------|---------|
| 1 | `LocationStep` | Province selection, GPS coordinates, map picker |
| 2 | `PlantSelectionStep` | Visual plant selection cards |
| 3 | `PestSelectionStep` | Pest/disease selection cards |
| 4 | `IssueDetailsStep` | Dates, area, severity, image upload |
| 5 | `ReporterStep` | Anonymous toggle, contact info |

## Usage

```tsx
import {
  LocationStep,
  PlantSelectionStep,
  PestSelectionStep,
  IssueDetailsStep,
  ReporterStep,
  FormNavigation,
  type PestReportFormData
} from "./components";

// In parent component
const [formData, setFormData] = useState<PestReportFormData>(initialData);
const [currentStep, setCurrentStep] = useState<StepId>("location");

// Render current step
{currentStep === "location" && (
  <LocationStep
    provinces={provinces}
    formData={formData}
    setFormData={setFormData}
  />
)}
```

## Design Patterns

### State Management
- Lifting state up: Form data managed in parent (`SurveyFormClient.tsx`)
- Each step receives `formData` and `setFormData` props
- Updates via `handleInputChange` helper

### Consistent UI
- Header pattern: Icon + Title + Description
- All steps use `CardHeader` + `CardContent` structure
- Color coding: Primary (blue) for selected, Muted for unselected
- Responsive grid: `grid-cols-1 md:grid-cols-2`

### Accessibility
- All inputs have associated labels
- Required fields visually indicated
- Error states with descriptive messages

## Benefits of This Structure

1. **Maintainability**: Each step is <200 lines, easy to understand
2. **Testability**: Components can be tested in isolation
3. **Reusability**: Steps could be rearranged or reused elsewhere
4. **Performance**: Only current step renders, map lazy-loaded
5. **Type Safety**: Shared types ensure consistency

## Future Enhancements

- Add step validation before navigation
- Persist form data to localStorage
- Add progress indicator animation
- Support for saving drafts
