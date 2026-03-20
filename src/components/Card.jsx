import React, {Component} from 'react';

class Card extends Component {

    render() {

        return(

            <div className="col">
                <div className="card" style={{width: '18rem', textAlign: 'center'}}>
                    <button onClick={() => this.props.onIncrement(this.props.card)} className="btn btn-primary">
                        Aggiungi <span className='badge badge-light'>{this.props.card.quantity}</span>
                    </button>
                    <img src={this.props.card.image} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{this.props.card.name}</h5>
                        <p className="card-text">{this.props.card.description}</p>
                        <button onClick={() => this.props.onDelete(this.props.card.id)} className="btn btn-outline-danger">Elimina</button>
                    </div>
                </div>
            </div>

        );

    }

}

export default Card;