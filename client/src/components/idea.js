import { MdDeleteForever } from "react-icons/md";
import { useEffect, useState, useRef } from "react";

const Idea = ({ title, description, date, deleteIdea, id, idea, setIdea, setUpdate, dateFilter, titleFilter, titleSort }) => {

    const [field, setField] = useState({ title, description, date, id });
    const titleRef = useRef(null);
    const [lateUpdate, setLateUpdate] = useState(false);

    useEffect(() => {
        titleRef.current.focus();
    }, [])

    useEffect(() => {
        if(lateUpdate)
            titleSort();
        setLateUpdate(false);
    }, [lateUpdate])
    
    const handleChange = (event) => {
        if (event.target.name === 'title') {
            setField({ ...field, title: event.target.value });
        }
        else if (event.target.name === 'description') {
            setField({ ...field, description: event.target.value });
        }   
    }

    const handleBlur = (event) => {
        if (event.target.value.length > 0) {
            setUpdate(true);
            setTimeout(() => { setUpdate(false) }, 1000);
            setIdea({ ...idea, [id]: { ...idea[id], ...field } });
            setLateUpdate(true);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            event.target.blur();
        }     
    }

    return (<div className="idea">
        <form className="form">
            <input type='text' value={field.title} onChange={handleChange} name='title' placeholder={field.title ? '' : 'title'} ref={titleRef} style={{ border: 0 }} className='onFocus' onBlur={handleBlur} onKeyDown={handleKeyDown}/>
            <textarea value={field.description} onChange={handleChange} name='description' placeholder={field.description ? '' : 'description'} maxLength="140" style={{ border: 0, resize: 'none', height: '80px' }} className='onFocus' onBlur={handleBlur} onKeyDown={handleKeyDown} />
            <small style={{marginLeft:'105px', display: `${140-field.description.length<15?'inline':'none'}` }}>{`${140-field.description.length}/140`}</small>
            </form>
        <div className="Idea-footer">
            <small>{field.date}</small>
            <MdDeleteForever className="delete-icon" size="1.3em" onClick={deleteIdea} id={id} />
        </div>
    </div>)
}
export default Idea;