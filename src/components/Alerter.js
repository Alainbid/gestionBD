import React from 'react';
import '../styles/alerter.scss';

const Alerte = ({ onConfirm, onCancel }) => {
    return (
        <div className='panneau'>
            <> Voulez-vous vraiment supprimer ces documents? </>
            <div  style={{ display: 'flex', flexDirection: 'row' }}>
            
                <span className='btn' onClick={onConfirm}>Oui</span>
                <span className='btn' onClick={onCancel} style = {{ background:'lightgrey'}}>Non</span>
            </div>
        </div>
    );
};

export default Alerte;
