const courseList = async (req, res, conn) => {
    try {
        let roleId = req.session.name.split(":")[0]
        console.log("rold id:",roleId)
        if (roleId === "1") {
            let [results] = await conn.query('SELECT * FROM Subjects')
            console.log(results)
            res.json(results)
        } 
        else if (roleId === "2") {
            console.log('Student login')
            let [results] = await conn.query('SELECT * FROM Subjects WHERE status = "active"')
            console.log(results)
            res.json(results)
        }
    } catch (error) {
        console.error('Error fetching subjects:', error.message)
        res.status(500).json({ error: 'Error fetching subjects' })
    }
}

export default courseList