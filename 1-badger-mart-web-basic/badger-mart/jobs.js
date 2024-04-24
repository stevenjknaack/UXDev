function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!

    // TODO: Alert the user of the job that they applied for!
    const jobRadios = document.getElementsByName("job");

    for (let jobRadio of jobRadios) {
        if (jobRadio.checked) {
            alert(`Thank you for applying to be a ${jobRadio.value}!`)
            return;
        }
    }

    alert("Please select a job!");
}