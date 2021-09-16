/**
 * Filters out the user table based on the given input.
 * You can test on page: /users/
 * Retrieved from https://www.w3schools.com/bootstrap/bootstrap_filters.asp
 */
$(document).ready(function () {
    $('#filterable-table').DataTable({
        responsive: true,
        pageLength: 25,
    });
    $('#filterable-table-consumable').DataTable({
        responsive: true,
        pageLength: 10,
    });
    $('#filterable-table-request').DataTable({
        responsive: true,
        pageLength: 10,
    });
    $('#filterable-table-job-batteries').DataTable({
        responsive: true,
        pageLength: 10,
    });
    
});






/**
 * Replaces due date format.
 */
$(document).ready(function () {
    let dueDateWrappers = document.getElementsByClassName("due-date");
    for (let i = 0; i < dueDateWrappers.length; i++) {
        dueDateWrappers[i].innerText = new Date(dueDateWrappers[i].innerText);
    }
});

/**
 * Counts down assignment dates
 */
$('[data-countdown]').each(function () {
    var $this = $(this),
        finalDate = $(this).data('countdown').replace("T", " ");
    $this.countdown(finalDate, function (event) {
        $this.html(event.strftime('%D days %H:%M:%S'));
    });
});

/**
 * Shows last updated date as time ago.
 */
$(document).ready(function () {
    $(".timeago").timeago();
});

/**
 * Displays confirmation message when something deleting
 * Usage: <a href="#" class="delete" role="button" data-confirm="Are you sure to delete assignment {{}}?"><i class="far fa-trash-alt"></i> Delete</a>
 * Retrieved from: https://stackoverflow.com/questions/9139075/how-to-show-a-confirm-message-before-delete
 */
$(document).ready(() => {
    const deleteLinks = document.querySelectorAll('.delete');

    for (let i = 0; i < deleteLinks.length; i++) {
        deleteLinks[i].addEventListener('click', function (event) {
            event.preventDefault();

            var choice = confirm(this.getAttribute('data-confirm'));

            if (choice) {
                window.location.href = this.getAttribute('href');
            }
        });
    }
});

/**
 * Adds colours to dashboard collapsable courses.
 */
$(document).ready(() => {
    const logos = document.querySelectorAll('.card-text-logo');
    const bgColors = ["blueviolet", "brown", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgreen", "darkmagenta", "tomato", "teal", "steelblue"];
    for (let i = 0; i < logos.length; i++) {
        logos[i].style.backgroundColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    }
});

/**
 * Sets first term courses open
 */
$(document).ready(() => {
    const terms = document.querySelectorAll('.coursesByTerms');
    
    if (terms && terms.length)
    {
        terms[0].classList.add("show");
    }
});

