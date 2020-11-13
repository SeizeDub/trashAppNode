if (document.getElementById('input-date')) {
    let inputDate = document.getElementById('input-date');
    flatpickr(inputDate, {
        allowInput: true,
        locale : 'fr',
        inline : true,
        disable : [
            function(date) {
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        monthSelectorType : "static",
        minDate : new Date().fp_incr(2),
        defaultDate : nextAvailableDate(),
    });
    inputDate.infoElement.remove();
}

function nextAvailableDate() {
    let date = new Date();
    date.setDate(date.getDate() + 2);
    while(date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}
