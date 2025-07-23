document.addEventListener('DOMContentLoaded', () => {
    const eventStartDateInput = document.getElementById('eventStartDate');
    const eventTimeInput = document.getElementById('eventTime');
    const recurrenceTypeSelect = document.getElementById('recurrenceType');
    const dayOfWeekGroup = document.getElementById('dayOfWeekGroup');
    const dayOfWeekSelect = document.getElementById('dayOfWeek');
    const numOccurrencesInput = document.getElementById('numOccurrences');
    const viewWindowStartDateInput = document.getElementById('viewWindowStartDate');
    const viewWindowEndDateInput = document.getElementById('viewWindowEndDate');
    const generateBtn = document.getElementById('generateBtn');
    const instanceList = document.getElementById('instanceList');

    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    eventStartDateInput.value = todayString;
    viewWindowStartDateInput.value = todayString;

    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    const oneMonthLaterString = oneMonthLater.toISOString().split('T')[0];
    viewWindowEndDateInput.value = oneMonthLaterString;

    function formatEventDate(date) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    }

    recurrenceTypeSelect.addEventListener('change', () => {
        if (recurrenceTypeSelect.value === 'daily') {
            dayOfWeekGroup.classList.add('hidden');
        } else {
            dayOfWeekGroup.classList.remove('hidden');
        }
    });

    generateBtn.addEventListener('click', () => {
        const eventStartDateString = eventStartDateInput.value;
        const eventTimeString = eventTimeInput.value;
        const recurrenceType = recurrenceTypeSelect.value;
        const selectedDayOfWeek = parseInt(dayOfWeekSelect.value, 10);
        const numOccurrences = parseInt(numOccurrencesInput.value, 10);
        const viewWindowStartDateString = viewWindowStartDateInput.value;
        const viewWindowEndDateString = viewWindowEndDateInput.value;

        if (!eventStartDateString || !eventTimeString || !numOccurrences || !viewWindowStartDateString || !viewWindowEndDateString) {
            alert('Please fill in all required fields (Start Date, Time, Occurrences, View Window).');
            return;
        }
        if (numOccurrences < 1) {
            alert('Number of occurrences must be at least 1.');
            return;
        }

        const initialEventDateTime = new Date(`${eventStartDateString}T${eventTimeString}:00`);
        const viewWindowStart = new Date(`${viewWindowStartDateString}T00:00:00`);
        const viewWindowEnd = new Date(`${viewWindowEndDateString}T23:59:59.999`);

        if (isNaN(initialEventDateTime.getTime()) || isNaN(viewWindowStart.getTime()) || isNaN(viewWindowEnd.getTime())) {
            alert('Invalid date or time format detected. Please ensure valid date (YYYY-MM-DD) and time (HH:MM) entries.');
            return;
        }

        if (viewWindowStart > viewWindowEnd) {
            alert('View Window "From Date" cannot be after "To Date". Please correct the view window range.');
            return;
        }

        const generatedInstances = [];
        let currentInstanceDate = new Date(initialEventDateTime);

        for (let i = 0; i < numOccurrences; i++) {
            let nextValidDate = new Date(currentInstanceDate);

            if (recurrenceType === 'weekly') {
                if (i === 0) {
                    const initialDay = initialEventDateTime.getDay();
                    const diff = (selectedDayOfWeek - initialDay + 7) % 7;
                    nextValidDate.setDate(initialEventDateTime.getDate() + diff);
                    nextValidDate.setHours(initialEventDateTime.getHours(), initialEventDateTime.getMinutes(), 0, 0);
                } else {
                    nextValidDate.setDate(currentInstanceDate.getDate() + 7);
                    nextValidDate.setHours(initialEventDateTime.getHours(), initialEventDateTime.getMinutes(), 0, 0);
                }
            } else {
                if (i > 0) {
                   nextValidDate.setDate(currentInstanceDate.getDate() + 1);
                }
                nextValidDate.setHours(initialEventDateTime.getHours(), initialEventDateTime.getMinutes(), 0, 0);
            }

            generatedInstances.push(nextValidDate);
            currentInstanceDate = new Date(nextValidDate);
        }

        instanceList.innerHTML = '';

        if (generatedInstances.length === 0) {
            instanceList.innerHTML = '<li class="placeholder">No instances generated based on the criteria.</li>';
            return;
        }

        generatedInstances.forEach(instanceDate => {
            const listItem = document.createElement('li');
            const formattedDate = formatEventDate(instanceDate);

            const isInsideViewWindow = (instanceDate >= viewWindowStart && instanceDate <= viewWindowEnd);

            if (!isInsideViewWindow) {
                listItem.classList.add('outside-view');
            }

            listItem.textContent = formattedDate;
            instanceList.appendChild(listItem);
        });
    });

    recurrenceTypeSelect.dispatchEvent(new Event('change'));
});