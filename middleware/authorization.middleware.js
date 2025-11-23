class Authorization {
    isAdmin(role) {
        return (req,res,next)=>(
            req.principal.role.includes(role) ? next() : res.status(403).send('Access denied ')
    )
    }
    isUser(role) {
        return (req,res,next)=>(
            req.principal.role.includes(role) ? next() : res.status(403).send('Access denied ')
        )
    }
}

export default new Authorization();