import { useEffect, useState } from "react";
import Idea from "./idea";
import { AiOutlinePlus } from "react-icons/ai";

const IdeaList = () => {
    const [idea, setIdea] = useState({});
    const [ideaArr, setIdeaArr] = useState([]);
    const [update, setUpdate] = useState(false);
    const [dateFilter, setDateFilter] = useState(false);
    const [titleFilter, setTitleFilter] = useState(false);

    useEffect(() => {
        
        if (localStorage.getItem('filter')) {
            if (localStorage.getItem('filter') === 'date') {
                setDateFilter(true);
                setTitleFilter(false);
                if(localStorage.getItem('ideas'))
                    setIdea(JSON.parse(localStorage.getItem('ideas')));
                else
                    setIdea({});
            }
            else if (localStorage.getItem('filter') === 'title') {
                setDateFilter(false);
                setTitleFilter(true);
                if(localStorage.getItem('ideasArray'))
                    setIdeaArr(JSON.parse(localStorage.getItem('ideasArray')));
                else
                    setIdeaArr([]);
            }
        }
        else {
            setDateFilter(true);
            setTitleFilter(false);
        }
    }, [])

    useEffect(() => {
        if (dateFilter) {
            if (Object.keys(idea).length > 0) {
                localStorage.setItem('ideas', JSON.stringify(idea));   
                let arr = [];
                arr = Object.keys(idea).map(key => ({ [key]: idea[key] }));
                localStorage.setItem('ideasArray', JSON.stringify(arr));
            }
            else {
                localStorage.removeItem('ideasArray');
                localStorage.removeItem('ideas');
            }
        }
        if (titleFilter) {
            if (ideaArr.length > 0) {
                localStorage.setItem('ideasArray', JSON.stringify(ideaArr));
                let obj = {};
                ideaArr.forEach(element => {
                    const e = { [Object.keys(element)[0]]: Object.values(element)[0] };
                    obj = { ...obj, ...e };
                })
                localStorage.setItem('ideas', JSON.stringify(obj));
            }
            else {
                localStorage.removeItem('ideasArray');
                localStorage.removeItem('ideas');
            }
        }
    }, [idea, ideaArr])

    const addNewTile = () => {
        if (Object.keys(idea).length === 0) {
            setIdea({[0]: { title: '', description: '', id: 0, date: new Date().toLocaleString() } });
            setIdeaArr([{[0]: { title: '', description: '', id: 0, date: new Date().toLocaleString() } }]);
        }
        if (dateFilter) {
            setIdea({ ...idea, [+(idea[Object.keys(idea)[Object.keys(idea).length-1]].id)+1]:{ title: '', description: '', id: +(idea[Object.keys(idea)[Object.keys(idea).length-1]].id)+1, date: new Date().toLocaleString() }});
        }
        else if (titleFilter) {
            setIdeaArr([...ideaArr, { [+(idea[Object.keys(idea)[Object.keys(idea).length - 1]].id) + 1]: { title: '', description: '', id: +(idea[Object.keys(idea)[Object.keys(idea).length - 1]].id) + 1, date: new Date().toLocaleString() } }]);
        }
    }

    const deleteIdea = (event) => {
        if (dateFilter) {
            let obj = { ...idea };
            delete obj[event.currentTarget.id];
            setIdea({ ...obj }); 
        }
        else if (titleFilter) {
            let obj = {};
            ideaArr.forEach(element => {
                const e = { [Object.keys(element)[0]]: Object.values(element)[0] };
                obj = { ...obj, ...e };
            });
            delete obj[event.currentTarget.id];
            let arr = [];
            arr = Object.keys(obj).map(key => ({ [key]: obj[key] }));
            setIdeaArr(arr);
        }
    }

    const titleSort = () => {
        let arr = [], obj = new Map(), arr2 = [];
        for (let element in idea) {
            arr = [...arr, idea[element].title];
        }
        arr.sort();
        arr.forEach((element) => {
            const obj2 = Object.values(idea).find(obj => obj.title === element);
            obj.set(obj2.id, { ...obj2 });
        });
        obj.forEach((key) => {
            arr2 = [...arr2, {[key.id]: key}];
        });
        setIdeaArr(arr2);
    }

    const handleChange = (event) => {
        if (event.target.value === 'date') {
            localStorage.setItem('filter', 'date');
            setDateFilter(true);
            setTitleFilter(false);
            const arr = Object.keys(JSON.parse(localStorage.getItem('ideas'))).sort();
            let obj = {};
            arr.forEach((element) => {
                obj = { ...obj, [element]: JSON.parse(localStorage.getItem('ideas'))[element] };
            });
            setIdea({ ...obj });
        }
        else if (event.target.value === 'title') {
           localStorage.setItem('filter', 'title');
            setDateFilter(false);
            setTitleFilter(true);
            titleSort();
        }
    }

    return (<>
        <select style={{marginLeft: '10px'}} onChange={handleChange} value={dateFilter?'date':'title'}>
            <option value='date'>date</option>
            <option value='title'>title</option>
        </select>
        <div className="Idea-List">
            {
                dateFilter ? Object.keys(idea)?.length > 0 && Object.keys(idea).map((key) => { return <Idea key={idea[key].id} title={idea[key].title} description={idea[key].description} date={idea[key].date} deleteIdea={deleteIdea} id={idea[key].id} idea={idea} setIdea={setIdea} setUpdate={setUpdate} dateFilter={dateFilter} titleFilter={titleFilter} titleSort={titleSort} /> }) :
                titleFilter ? ideaArr.length > 0 && ideaArr.map((obj) => { return <Idea key={Object.values(obj)[0].id} title={Object.values(obj)[0].title} description={Object.values(obj)[0].description} date={Object.values(obj)[0].date} id={Object.values(obj)[0].id}  deleteIdea={deleteIdea} idea={idea} setIdea={setIdea} setUpdate={setUpdate} dateFilter={dateFilter} titleFilter={titleFilter} titleSort={titleSort}/>}) :
                null
            }
            <div className="idea-add"><AiOutlinePlus size="3.5em" className="pointer" onClick={addNewTile}/></div>
        </div>
        {update && <div >
            <h3 className='update'>Notes is updated</h3>
        </div>}
    </>)
}

export default IdeaList;