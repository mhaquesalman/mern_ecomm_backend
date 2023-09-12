import React, { Component } from 'react';

class CommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: this.props.id,
            commentBody: '',
            commentRating: ''
        }
    }

    handleInputChange = e => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        console.log("state ", this.state)
    }

    render() {
        return (
            <div>
                <h4>Submit Comments</h4>
                <hr />
                <form onSubmit={(e) => this.handleSubmit(e)}>
                <div className="form-group">
                <input className='form-control'
                        name='commentBody'
                        value={this.state.commentBody}
                        type='textarea'
                        placeholder='write comment...'
                        required
                        onChange={(e) => this.handleInputChange(e)}
                    />
                </div>

                    <div className='form-group'>

                        <select className='form-control'
                        name='commentRating'
                        value={this.state.commentRating}
                        onChange={e => this.handleInputChange(e)}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                 
                    </div>
                    <button type='submit' className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }
}

export default CommentForm;