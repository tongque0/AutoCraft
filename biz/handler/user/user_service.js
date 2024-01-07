
export function HelloUserMethod(req,res){
    try {
        let user=req.body.user
        res.send(`hello ${user}`)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}


