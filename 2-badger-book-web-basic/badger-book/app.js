const STUDENTS = []; 

initPage();

function initPage() {
    // clear searches
    document.getElementById('search-name').value = '';
    document.getElementById('search-major').value = '';
    document.getElementById('search-interest').value = '';

    // get students 
    fetch('https://cs571.org/api/s24/hw2/students', {
        headers: {
            'X-CS571-ID': CS571.getBadgerId()
        }
    })
    .then((response) => response.json())
    .then((data) => {
        // #1
        console.log(data);

        // #2,#3,#4
        buildStudents(data);

        // save data for searching (assume we don't want to re-fetch each search)
        STUDENTS.push(...data);
    });
}

function buildStudents(studs) {
    // update number of results found #2
    document.getElementById('num-results').innerText = studs.length;

    // load all students in studs on the page #3, #4
    const studentsBox = document.getElementById('students');
    studentsBox.innerHTML = '';

    for (student of studs) { 
        // create box
        const studentBox = document.createElement('div');
        studentBox.className = ('col-12 col-md-6 col-lg-4 col-xl-3'); 
        
        // add name
        const nameBox = document.createElement('h2');
        nameBox.innerText = `${student.name.first} ${student.name.last}`;
        studentBox.appendChild(nameBox);

        // add major
        const majorBox = document.createElement('strong');
        majorBox.innerText = student.major;
        studentBox.appendChild(majorBox);

        // add credits and is from wisconsin
        const creditWiscBox = document.createElement('p');
        creditWiscBox.innerText = `${student.name.first} is taking ${student.numCredits} credits`
            + ` and is ${student.fromWisconsin ? '' : 'not'} from Wisconsin.`;
        studentBox.appendChild(creditWiscBox);

        // add interests
        const interestBoxLabel = document.createElement('p');
        interestBoxLabel.innerText = `They have ${student.interests.length} interests including...`;
        studentBox.appendChild(interestBoxLabel);

        const interestList = document.createElement('ul');
        interestList.style = 'padding-left: 1rem;';
        for (interest of student.interests) {
            const interestAnchor = document.createElement('a');
            interestAnchor.innerText = interest;

            // #6 add event handler to each interest
            interestAnchor.addEventListener('click', (event) => {
                // set search values
                document.getElementById('search-name').value = '';
                document.getElementById('search-major').value = '';
                document.getElementById('search-interest').value = event.currentTarget.innerText;
                
                // search
                handleSearch();
            });

            const interestBox = document.createElement('li');
            interestBox.appendChild(interestAnchor);
            interestList.appendChild(interestBox);
        }

        studentBox.appendChild(interestList);

        // add student
        studentsBox.appendChild(studentBox);
    }
}

function handleSearch(e) {
	e?.preventDefault();

    // prevent search before data is recieved
    if (!STUDENTS) {
        console.error('Student data not yet recieved.')
        return;
    }

    // get search values
    const searchName = document.getElementById('search-name').value.trim().toLowerCase();
    const searchMajor = document.getElementById('search-major').value.trim().toLowerCase();
    const searchInterest = document.getElementById('search-interest').value.trim().toLowerCase();
    
    // filter students
    const studResults = STUDENTS
    .filter(stud => { // filter name
        if (!stud?.name?.first && !stud?.name?.last && !searchName) return true;

        return `${stud.name.first.trim()} ${stud.name.last.trim()}`.toLowerCase().includes(searchName);
    })
    .filter(stud => { // filter major
        if (!stud.major && !searchMajor) return true;

        return stud.major.trim().toLowerCase().includes(searchMajor);
    })
    .filter(stud => { // filter interests
        if ((!stud.interests || stud.interests.length === 0) && !searchInterest) return true;

        return (stud.interests).some(interest => {
            return interest.trim().toLowerCase().includes(searchInterest);
        })
    });

    // load students
    buildStudents(studResults);
    
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
