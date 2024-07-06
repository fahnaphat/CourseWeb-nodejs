axios.defaults.withCredentials = true
let sessionName = ''
axios.get('http://localhost:8000')
    .then(res => {
        if (res.data.valid) {
            // console.log(res.data.name)
            let user = res.data.name.split(":")
            if (user[0] === "1") {
                sessionName = res.data.name
                document.getElementById('text').textContent = `Welcome ${user[2]}`
                document.getElementById('login-btn').style.display = 'none';
                document.getElementById('logout-btn').style.display = 'inline-block';
            } else {
                window.location.href = './index.html'
            }
        }
    })
    .catch(err => console.log(err.response))

/* list all courses */
axios.get('http://localhost:8000/course')
    .then(res => {
        let courseCard = document.getElementById('list-course')
        let item = ''
        if (res.data.length > 0) {
            // console.log(res.data)
            for (let i = 0; i < res.data.length; i++) {
                item += '<div class="course-card">'
                let subjectId = res.data[i].id;
                item += '<div class="content">'
                item += `<h3>${res.data[i].name}</h3>`  
                item += `<p>Description: ${res.data[i].category}</p>`
                item += `<p>Teacher: ${res.data[i].teacher}</p>`
                item += '<ul>'
                if (res.data[i].status === 'active') {
                    item += `<li class="status open">Open</li>`
                } else {
                    item += `<li class="status dead">Close</li>`
                }
                item += '</ul>'
                item += '<div class="btn">'
                item += '<div class="edit-del-btn">'
                item += `<button id="edit-btn-${subjectId}" class="edit-btn" onclick="EditCourse(${subjectId})">Edit</button>`;
                item += `<button id="delete-btn-${subjectId}" class="del-btn" style="background-color: #f44336;" onclick="DeleteCourse(${subjectId})">Delete</button>`;
                item += '</div>'
                item += `<button id="seeEnroll-btn-${subjectId}" class="numenroll-btn" onclick="SeeCourse(${subjectId})">Number of Enrolled</button>`
                item += '</div>'
                item += '</div>'
                item += '</div>'
            }
            courseCard.innerHTML = item
        }
    })
    .catch(err => console.log(err.response))

function EditCourse(subjectId) {
    console.log(`Edit course with ID: ${subjectId}`);
    document.getElementById('create-btn').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'inline-block';
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var cancelbtn = document.getElementById("cancel-btn");
    var Editbtn = document.getElementById("edit-btn");

    /* fetching subject by id */
    axios.get(`http://localhost:8000/course/${subjectId}`)
        .then(res => {
            if (res.data.length > 0) {
                console.log(res.data)
                console.log(res.data[0].name)
                document.getElementById('cname').value = res.data[0].name || '';
                document.getElementById('category').value = res.data[0].category || '';
                document.getElementById('teacher').value = res.data[0].teacher || '';
                if (res.data[0].status === "active") {
                    document.getElementById('active').checked = true;
                } else {
                    document.getElementById('inactive').checked = true;
                }
            }
        })
        .catch(err => console.log(err.response))

    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        window.location.href = './index.html'
    }
    cancelbtn.onclick = function() {
        modal.style.display = "none";
        window.location.href = './index.html'
    }

    /* call api for update subject by id */
    Editbtn.onclick = async function() {
        try {
            let updateSubject = {
                user_id: sessionName.split(":")[1],
                name: document.getElementById('cname').value,
                category: document.getElementById('category').value,
                teacher: document.getElementById('teacher').value,
                status: document.querySelector('input[name="status"]:checked').value
            }
            // console.log(updateSubject)
            
            const response = await axios.put(
                `http://localhost:8000/course/edit/${subjectId}`, 
                updateSubject
            )
            // console.log(response.data)
    
            if (response.data.success) {
                alert(response.data.message)
                window.location.href = './admin.html'
            }
        } catch (error) {
            let nameMsgErr = document.getElementById('error-cname')
            nameMsgErr.innerHTML = ''
            let categoryMsgErr = document.getElementById('error-category')
            categoryMsgErr.innerHTML = ''
            let teacherMsgErr = document.getElementById('error-teacher')
            teacherMsgErr.innerHTML = ''
            let errors = error.errors || []
            let errMsg = error.response.data.message
            // console.log(error.message)
            if (error.response && error.response.data) {
                // console.log(errMsg)
                errors = error.response.data.errors
                // console.log("what res:", error.response.data.errors)
            }
            if (errors && errors.length > 0) {
                for (let i=0; i < errors.length; i++) {
                    let msgErr = errors[i].split(":")
                    if (msgErr[0] === "1") { nameMsgErr.innerHTML = msgErr[1] }
                    if (msgErr[0] === "2") { categoryMsgErr.innerHTML = msgErr[1] }
                    if (msgErr[0] === "3") { teacherMsgErr.innerHTML = msgErr[1] }
                }
            }
        }
    }

}

function DeleteCourse(subjectId) {
    // console.log(`Delete course with ID: ${subjectId}`);
    var modelDel = document.getElementById('confirmModal');
    var span = document.getElementsByClassName("close-del")[0];
    var cancelbtn = document.getElementById("cancelDelete");
    var deletebtn = document.getElementById("confirmDelete");
    modelDel.style.display = "block";
    span.onclick = function() {
        modelDel.style.display = "none";
    }
    cancelbtn.onclick = function() {
        modelDel.style.display = "none";
    }

    deletebtn.onclick = async function() {
        try {
            const response = await axios.delete(`http://localhost:8000/course/delete/${subjectId}`)
    
            if (response.data.success) {
                alert(response.data.message)
                window.location.href = './admin.html'
            }
        } catch (error) {
            // let errMsg = error.response.data.message
            console.log(error.response.data.message)
        }
    }
}

function SeeCourse(subjectId) {
    window.location.href = `adminCourse.html?sid=${subjectId}`
}

    
const logout = () => {
    axios.post('http://localhost:8000/logout')
        .then(res => {
            // console.log(res)
            if (res.status === 200) {
                window.location.href = './index.html';
            }
        })
        .catch(err => console.log(err));
}

const createNewCourse = () => {
    document.getElementById('create-btn').style.display = 'inline-block';
    document.getElementById('edit-btn').style.display = 'none';
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var cancelbtn = document.getElementById("cancel-btn");
    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        window.location.href = './index.html'
    }
    cancelbtn.onclick = function() {
        modal.style.display = "none";
        window.location.href = './index.html'
    }
}

const submitCreate = async () => {
    try {
        let subjectData = {
            user_id: sessionName.split(":")[1],
            name: document.getElementById('cname').value,
            category: document.getElementById('category').value,
            teacher: document.getElementById('teacher').value,
            status: document.querySelector('input[name="status"]:checked').value
        }
        // console.log(subjectData)
        
        const response = await axios.post(
            'http://localhost:8000/course/create', 
            subjectData
        )
        // console.log(response.data)

        if (response.data.success) {
            alert(response.data.message)
            window.location.href = './admin.html'
        }

    } catch (error) {
        let nameMsgErr = document.getElementById('error-cname')
        nameMsgErr.innerHTML = ''
        let categoryMsgErr = document.getElementById('error-category')
        categoryMsgErr.innerHTML = ''
        let teacherMsgErr = document.getElementById('error-teacher')
        teacherMsgErr.innerHTML = ''
        let errors = error.errors || []
        if (error.response && error.response.data) {
            errors = error.response.data.errors
        }
        if (errors && errors.length > 0) {
            for (let i=0; i < errors.length; i++) {
                let msgErr = errors[i].split(":")
                if (msgErr[0] === "1") { nameMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "2") { categoryMsgErr.innerHTML = msgErr[1] }
                if (msgErr[0] === "3") { teacherMsgErr.innerHTML = msgErr[1] }
            }
        }

    }
}