const querydata = {
    app_id:process.env.REACT_APP_APP_ID,
    app_key:process.env.REACT_APP_APP_KEY 
}

const fetchData = async (defaultQuery) => {
    const {app_id, app_key} = querydata
    try{
        const data = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${defaultQuery}&app_id=${app_id}&app_key=${app_key}`)
        const json = await data.json()
        return json
    }
    catch(e){
        return e
    }
}

export {fetchData}