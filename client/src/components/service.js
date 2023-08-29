const querydata = {
    // app_id: process.env.REACT_APP_APP_ID,
    // app_key: process.env.REACT_APP_APP_KEY
    app_id: "999f1041",
    app_key: "0dcd812c836f9807819e53710eb3f20c"
}

export const fetchData = async (defaultQuery) => {
    const {app_id, app_key } = querydata

    try{
        const data = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${defaultQuery}&app_id=${app_id}&app_key=${app_key}`);
        const response = await data.json();
        return response;
    }
    catch(e) {
        return e
    }
}  