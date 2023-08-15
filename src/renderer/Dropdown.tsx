import React , {useState, useRef, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'

function Dropdown( { id, title, items = [], multiSelect = false, isOpen = false, onToggle, onSelect, reset } ) {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState([]);
    const dropdownRef = useRef(null);
    const toggle = () => onToggle(id);
    
    useEffect(() => {
            setSelection([]);
    }, [reset]);

    function handleOnClick(item) {
        if (!selection.some(current => current.id === item.id)) {
            if (!multiSelect) {
                setSelection([item]);
            } else if (multiSelect) {
                setSelection([...selection, item]);
            }
        } else {
            let selectionAfterRemoval = selection;
            selectionAfterRemoval = selectionAfterRemoval.filter(
                current => current.id !== item.id
            );
            setSelection([...selectionAfterRemoval]);
        }
        onToggle(id);  
    
        if (onSelect) {
            onSelect(item);
        }
    }
    
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
                onToggle(id);
            }
        };
    
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, onToggle, id, isOpen]);
    




    return (
        <div className="dd-wrapper" ref={dropdownRef}>
            <div
                tabIndex={0}
                className="dd-header"
                role="button" 
                onKeyPress={() => toggle()} 
                onClick={() => toggle()} >
                    <div className="dd-header-title">
                        <p className="dd-header-title--bold">{selection.length > 0 ? selection[0].value : title}</p>
                    </div>
                    <div className="dd-header-action">
                        {isOpen ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}
                    </div>

            </div>
            {isOpen && (
                <ul className="dd-list">
                    {items.map(item => (
                    <li className="dd-list-item" key={item.id}>
                        <button type="button" onClick={() => handleOnClick(item)}>
                        <span>{item.value}</span>
                        </button>
                    </li>
                ))}
              </ul>
              
              
            )}
        </div>
    );
}


export default Dropdown;