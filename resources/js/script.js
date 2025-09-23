let currentEventIndex = -1;


function updateLocationOptions(modality) {
    const locationFields = document.getElementById("location-fields");
    const remoteUrlFields = document.getElementById("remote-fields");
    const attendeesField = document.getElementById("attendees-field");

    locationFields.classList.add("d-none");
    remoteUrlFields.classList.add("d-none");
    attendeesField.classList.add("d-none");

    if (modality === "in-person") {
        locationFields.classList.remove("d-none");
        attendeesField.classList.remove("d-none");
    } else if (modality === "remote") {
        remoteUrlFields.classList.remove("d-none");
        attendeesField.classList.remove("d-none");
    }
}

// events array
let events = [];

function saveEvent() {
    const name = document.getElementById('event_name').value;
    const weekday = document.getElementById('event_weekday').value;
    const time = document.getElementById('event_time').value;
    const modality = document.getElementById('event_modality').value;
    const location = document.getElementById('event_location').value;
    const remote_url = document.getElementById('event_remote_url').value;
    const attendees = document.getElementById('event_attendees').value;
    const category = document.getElementById('event_category').value;

    //array to hold specific event
    const eventDetails = [name, weekday, time, modality, location, remote_url, attendees, category];


     
    if (currentEventIndex !== -1) {
        // updating existing event
        events[currentEventIndex] = eventDetails;
        currentEventIndex = -1;
    } else {
        // New event
        events.push(eventDetails);
    }

    console.log(events);

    renderEvents();
    
    document.getElementById('event-form').reset();


    //resets the form to not display location, url, and attendees by default
    updateLocationOptions('');


}

function createEventCard(eventDetails) {
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1';

    const category = eventDetails[7];

    if (category === "work") {
        event_element.classList.add("category-work");
    } else if (category === "training") {
        event_element.classList.add("category-training");
    } else if (category === "fun") {
        event_element.classList.add("category-fun");
    } else if (category === "compsci-dept") {
        event_element.classList.add("category-compsci-dept");
    }

    let info = document.createElement('div');

    const eventIndex = events.indexOf(eventDetails);
    event_element.setAttribute('onclick', `openUpdateModal(${eventIndex})`);

    let locationInfo = '';
    //check if in-person and if user put in location
    if (eventDetails[3] === 'in-person' && eventDetails[4]) {
        locationInfo = `<div>Location: ${eventDetails[4]}</div>`;
    }
    // same with URL
    else if (eventDetails[3] === 'remote' && eventDetails[5]) {
        locationInfo = `<div>Remote URL: ${eventDetails[5]}</div>`;
    }

    info.innerHTML = `
        <div>Event Name: ${eventDetails[0]}</div>
        <div>Weekday: ${eventDetails[1]}</div>
        <div>Time: ${eventDetails[2]}</div>
        <div>Modality: ${eventDetails[3]}</div>
        ${locationInfo}  
        <div>Attendees: ${eventDetails[6]}</div>
        <div>Category: ${category}</div>
    `;

    event_element.appendChild(info);

    return event_element;
}


function addEventToCalendarUI(eventInfo) {

    let event_card = createEventCard(eventInfo);

    const weekday = eventInfo[1].toLowerCase(); //id's of weekdays in index are lowercase
    const dayDiv = document.getElementById(weekday);

    if (dayDiv) {
        dayDiv.appendChild(event_card);
    }

}

function openUpdateModal(index) {
  const eventData = events[index];

  currentEventIndex = index;
  
  document.getElementById('event_name').value = eventData[0];
  document.getElementById('event_weekday').value = eventData[1];
  document.getElementById('event_time').value = eventData[2];
  document.getElementById('event_modality').value = eventData[3];
  document.getElementById('event_category').value = eventData[7];

  updateLocationOptions(eventData[3]);

  document.getElementById('event_location').value = eventData[4];
  document.getElementById('event_remote_url').value = eventData[5];
  document.getElementById('event_attendees').value = eventData[6];
  
  const modal = new bootstrap.Modal(document.getElementById('event_modal'));
  modal.show();
}

function renderEvents() {
    // Clear the calendar
     document.getElementById('sunday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Sunday</div>';
    document.getElementById('monday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Monday</div>';
    document.getElementById('tuesday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Tuesday</div>';
    document.getElementById('wednesday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Wednesday</div>';
    document.getElementById('thursday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Thursday</div>';
    document.getElementById('friday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Friday</div>';
    document.getElementById('saturday').innerHTML = '<div class="h6 text-center position-relative py-2 day">Saturday</div>';

    // Loop through all events and add them back to the calendar
    events.forEach(eventInfo => {
        addEventToCalendarUI(eventInfo);
    });
}