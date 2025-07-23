# Recurring Event Instance Generator UI

This project is a simple web-based user interface that allows you to define a recurring event and then generate and display its occurrences within a specified date range. It supports both daily and weekly recurrence patterns and highlights instances that fall outside the defined view window.

## Features

* **Define Event Start:** Specify the exact date and time for the first occurrence of your event.
* **Recurrence Type:** Choose between:
    * **Weekly:** The event repeats on a specific day of the week.
    * **Daily:** The event repeats every day.
* **Number of Occurrences:** Set how many times the event should repeat.
* **View Window:** Define a start and end date to filter and display event instances.
* **Dynamic Generation:** Generate event instances based on your defined rules.
* **Visual Highlighting:** Instances that fall outside the specified "View Window" are visually differentiated (grayed out and struck through).

## Technologies Used

* **HTML5:** For the structure and input elements of the user interface.
* **CSS3:** For styling and layout to make the UI user-friendly.
* **JavaScript (Vanilla ES6+):** For all the interactive logic, including:
    * Handling user input.
    * Calculating recurring event dates.
    * Filtering instances based on the view window.
    * Dynamically updating the DOM to display results.

## Setup and Installation

To run this project locally, follow these simple steps:

1.  **Clone the repository (or download the files):**
    If you're using Git, you can clone the repository:
    ```bash
    git clone https://github.com/45beepy/think41.git
    cd recurring-event-generator
    ```
    Alternatively, you can just download the `index.html`, `style.css`, and `script.js` files into a single folder on your computer.

2.  **Open `index.html`:**
    Navigate to the folder where you saved the files and simply double-click the `index.html` file. It will open directly in your default web browser.

No special server or build tools are required as it's a pure client-side application.

## Usage

1.  **Define Event Rule:**
    * **Event Start Date:** Select the initial date for your event.
    * **Event Time:** Select the specific time for your event (e.g., 09:00 AM).
    * **Recurrence Type:** Choose either "Weekly" or "Daily".
        * If "Weekly" is selected, the "Day of Week" dropdown will appear. Choose the day.
        * If "Daily" is selected, the "Day of Week" dropdown will disappear.
    * **Number of Occurrences:** Enter a positive integer for how many times the event should repeat.

2.  **Define View Window:**
    * **From Date:** Select the start date of the period you want to view event instances.
    * **To Date:** Select the end date of the period you want to view event instances.

3.  **Generate Instances:**
    * Click the "Generate Instances" button.

4.  **View Results:**
    * The "Generated Event Instances" section will display a list of all calculated occurrences.
    * Instances that fall **outside** your specified "View Window" will be grayed out and have a strikethrough, indicating they occur but are not within your current display range.

## Milestones Achieved

This project was developed incrementally, addressing specific requirements as milestones:

### Milestone 1: Event Time Input

* **Requirement:** Add a time input for the event (e.g., 9:00 AM). Display the time along with the date for each instance.
* **How Achieved:**
    * **UI (`index.html`):** Implemented using `<input type="time" id="eventTime">` for a native, user-friendly time selection.
    * **Logic (`script.js`):**
        * The `eventTimeInput.value` (e.g., "09:00") is retrieved.
        * It's combined with the date string (e.g., "2025-07-23") using the ISO 8601 format (`YYYY-MM-DDTHH:MM:SS`) to create a complete JavaScript `Date` object: `` new Date(`${startDateString}T${timeString}:00`) ``. This ensures both date and time are correctly represented.
        * During recurrence calculations, `Date.prototype.setHours()` is explicitly used to preserve the original event's hour and minute, ensuring the time component doesn't get reset when advancing the date (e.g., by adding days or weeks).
        * The `formatEventDate` helper function uses `toLocaleString` with `hour` and `minute` options to display the time along with the date.

### Milestone 2: Support "Daily" Recurrence

* **Requirement:** Modify the UI to allow selecting "Daily" recurrence instead of a specific day of the week. Update generation logic accordingly.
* **How Achieved:**
    * **UI (`index.html`):**
        * Introduced a new `<select id="recurrenceType">` dropdown with options "Weekly" and "Daily".
        * Wrapped the existing "Day of Week" dropdown and its label in a `div` with `id="dayOfWeekGroup"` to allow for easy toggling.
    * **Styling (`style.css`):** Added a `.hidden { display: none !important; }` CSS class.
    * **Logic (`script.js`):**
        * An `addEventListener` was added to `recurrenceTypeSelect`. When its value changes, it dynamically adds or removes the `hidden` class from `dayOfWeekGroup`, making the "Day of Week" input appear or disappear as needed.
        * The core event generation loop now includes an `if/else` block that checks the `recurrenceType`.
            * If `weekly`, it continues to use the `selectedDayOfWeek` to calculate the next occurrence (adding 7 days for subsequent instances).
            * If `daily`, it simply adds 1 day to the `currentInstanceDate` for each subsequent occurrence, regardless of the day of the week.
        * An initial `dispatchEvent` for `recurrenceTypeSelect` is included on `DOMContentLoaded` to set the correct visibility state on page load.

### Milestone 3: Highlight Instances Outside View Window (Optional)

* **Requirement:** Instead of just filtering, display all generated instances but visually differentiate (e.g., gray out) those outside the specified view window.
* **How Achieved:**
    * **Logic (`script.js`):**
        * After generating all `numOccurrences` instances, each `instanceDate` is compared against `viewWindowStart` and `viewWindowEnd` using `instanceDate >= viewWindowStart && instanceDate <= viewWindowEnd`.
        * If an instance falls *outside* this range, a CSS class `outside-view` is added to its corresponding `<li>` element in the `instanceList`.
    * **Styling (`style.css`):**
        * The `.outside-view` class is defined with styles like `color: #bbb;` (light gray) and `text-decoration: line-through;` to visually indicate that the event is outside
