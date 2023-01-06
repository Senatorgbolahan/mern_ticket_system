import React, {useEffect,useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeTicket, getTicket, reset } from '../features/tickets/ticketSlice'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getNotes,createNotes } from '../features/notes/noteSlice'
import NoteItem from '../components/NoteItem'
import Modal from 'react-modal'
import { FaPlus } from 'react-icons/fa'


const customStyles = {
    content: {
      width: '600px',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative',
    },
  }

  Modal.setAppElement('#root')

function Ticket() {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [noteText, setNoteText] = useState("")

    const {isLoading, isSuccess, message, isError} = useSelector((state) => state.tickets)
    const {ticket} = useSelector((state) => state.tickets)

    const {notes, isLoading: noteIsLoading} = useSelector((state) => state.notes)
    
    const params = useParams()
    const dispatch = useDispatch()
    const {ticketId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        dispatch(getTicket(ticketId))
        dispatch(getNotes(ticketId))
        // eslint-disable-next-line
    },[isError, message, ticketId,])

    const onTicketClose = () => {
        dispatch(closeTicket(ticketId))
        toast.success("Ticket Closed")
        navigate('/tickets')
    }

    // Open/Closed modal
    const openModal = () => {
        setModalIsOpen(true)
    }
    // Open/Closed modal
    const closeModal = () => {
        setModalIsOpen(false)
    }

    // Create note submit
    const onNoteSubmit = (e) => {
        e.preventDefault()
        dispatch(createNotes({noteText, ticketId}))
        closeModal()
    }

    if (isLoading || noteIsLoading) {
        <Spinner />
    }

    if (isError) {
        return <h3>Something went wrong</h3>
    }


    return (
    <div className='ticket-page'>
        <header className="ticket-header">
            <BackButton url= '/tickets' />
            <h2>Ticket ID: {ticket._id}
            <span className={`status status-${ticket.status}`}>{ticket.status}</span></h2>
            <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-US")}</h3>
            <h3>Product: {ticket.product}</h3>
            <hr />
            <div className="ticket-desc">
                <h3>Description of Issues</h3>
                <p>{ticket.description}</p>
            </div>
            <h2>Notes</h2>
        </header>

        {ticket.status !== "closed" && (<button onClick={openModal} className='btn'>Add Note</button>)}
        {notes.map((note) => {
            return <NoteItem key={note._id} note={note}/>
        })}

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
            <h2>Add Notes</h2>
            <button className='btn-close' onClick={closeModal}> X </button>
            <form onSubmit={onNoteSubmit}>
                <div className="form-group">
                    <textarea 
                        name="noteText"
                        id='noteText'
                        className='form-control'
                        placeholder='Note Text'
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <button className='btn' type='submit'>Submit</button>
                </div>
            </form>
        </Modal>

        {ticket.status !== "closed" && (<button onClick={onTicketClose} className="btn btn-block btn-danger">Close Ticket</button>)}
    </div>
  )
}

export default Ticket