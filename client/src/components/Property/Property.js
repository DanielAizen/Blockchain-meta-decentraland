import React, {useEffect, useReducer, useState} from "react";
import PropertyPopUp from "../PropertyPopUp/PropertyPopUp";
import "./Property.css"

export const ACTIONS = {Bought: 'setBought', Road: "setRoad", Park: 'setPark', Available: 'setAvailable', NewPrice: 'setNewPrice'}

const roads = [17, 20, 21, 22, 37, 42, 56, 57]
const parks = [58, 59, 78, 79]

const propertyReducer = (property, action) => {
    switch (action.type) {
        case ACTIONS.Bought:
            return {...property, pType: "house", isOwned: true, isBuyable: true}
        case ACTIONS.Road:
            return {...property, pType: "road"}
        case ACTIONS.Park:
            return {...property, pType:"park"}
        case ACTIONS.Available:
            return {...property, pType: "available", isBuyable: true}
        case ACTIONS.NewPrice:
            return {...property, price: action.newPrice}
        default:
            return property;
    }
}

const Property = (props) => {
    const INITIAL_STATE = {
        id: props.id,
        price: props.price,
        isOwned: false,
        isBuyable: false,
    };
    const [popup, setPopup] = useState(false);
    const [property, dispatch] = useReducer(propertyReducer, INITIAL_STATE);
    const hexId = `0x00000000000000000000000000000000000000${props.id.toString(16)}`;
    const owners = props.owners
    const setProperty = async () => {
        if (props.contract) {
            try {
                if (owners.includes(props.id)) {
                    dispatch( {type: ACTIONS.Bought})
                } else {
                    if (roads.includes(props.id)){
                        dispatch({type: ACTIONS.Road})
                    } else {
                        if (parks.includes(props.id)){
                            dispatch({type: ACTIONS.Park})
                        } else {
                            if (!owners.includes(props.id)) {
                                dispatch( {type: ACTIONS.Available})
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error + "/n can't retrive information")
            }
        }
    }

    useEffect( () => {
        setProperty()
    }, [owners])

    const handlePopup = () => {
        if (property.isBuyable) {
            console.log(property);
            setPopup(true);
        } else {
            console.log(`${props.id}- is of type ${property.pType}`);
        }
    }

    const handleClosePopup = () => {
        setPopup(false);
    }

    return (
        <div >
            <button className={` size ${property.pType}`} onClick={handlePopup}></button>
            {popup ? 
                <PropertyPopUp 
                id={props.id}
                hexId={hexId}
                contract={props.contract} 
                account={props.accounts} 
                price={property.price} 
                isOwned1={property.isOwned}
                dispatch={dispatch}
                closePopup={handleClosePopup}
                />
            : ""}     
        </div>
    )
}

export default Property