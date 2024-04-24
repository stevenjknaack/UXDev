import { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Pagination } from 'react-bootstrap';
import Student from './Student';

const Classroom = () => {
    const [students, setStudents] = useState([]); // #1
    // #6
    const [sNameVal, setSNameVal] = useState('');
    const [sMajorVal, setSMajorVal] = useState('');
    const [sInterestVal, setSInterestVal] = useState('');
    const [shownStudents, setShownStudents] = useState([]);
    // #8
    const maxNumPerPage = 24; // could also be a state var set by a select form
    const numPages = Math.ceil(shownStudents.length / maxNumPerPage); // easily derived so shouldn't be state
    const [currPage, setCurrPage] = useState(1);

    useEffect(() => { // #1
        fetch('https://cs571.org/api/s24/hw4/students', {
            headers: {
                'X-CS571-ID': CS571.getBadgerId()
            }
        })
            .then(res => {
                console.log(res.status);
                return res.json();
            })
            .then(data => {
                console.log(data);
                setStudents(data);
            })
    }, []);

    useEffect(() => { // #6
        const filteredStudents = students
            .filter(s => { 
                const name = `${s.name.first.trim()} ${s.name.last.trim()}`.toLowerCase();
                return name.includes(sNameVal.trim().toLowerCase());
            })
            .filter(s => {
                const major = s.major.trim().toLowerCase();
                return major.includes(sMajorVal.trim().toLowerCase());
            })
            .filter(s => {
                if (s.interests.length === 0 && sInterestVal.trim() === '') return true;

                return s.interests.some(intr => {
                    const interest = intr.trim().toLowerCase();
                    return interest.includes(sInterestVal.trim().toLowerCase());
                })
            });

        setShownStudents(filteredStudents);
        setCurrPage(1); //#8
    }, [students, sNameVal, sMajorVal, sInterestVal])

    const buildPagination = () => { // #8 // TODO SHOULD I DISPLAY 1 if there are no pages
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(
                <Pagination.Item
                    key={i}
                    active={i === currPage}
                    onClick={() => setCurrPage(i)}
                >{i}</Pagination.Item>
            );
        }
        return pages;
    }

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor='searchName'>Name</Form.Label>
            <Form.Control 
                id='searchName'
                value={sNameVal} 
                onChange={e => setSNameVal(e.target.value)}
            />
            <Form.Label htmlFor='searchMajor'>Major</Form.Label>
            <Form.Control 
                id='searchMajor' 
                value={sMajorVal} 
                onChange={e => setSMajorVal(e.target.value)}
            />
            <Form.Label htmlFor='searchInterest'>Interest</Form.Label>
            <Form.Control 
                id='searchInterest' 
                value={sInterestVal} 
                onChange={e => setSInterestVal(e.target.value)}
            />
            <br />
            <Button variant='neutral' onClick={() => { // #7
                setSNameVal('');
                setSMajorVal('');
                setSInterestVal('');
                setCurrPage(1); //#8
            }}>Reset Search</Button>
        </Form>
        {/* #2 */}
        <br />
        <p>{!students.length ? 'Loading...' 
                : `There are ${shownStudents.length} student(s) matching your search.`}</p>
        <Container fluid>
            <Row>
                { /* #3, #4 */
                    shownStudents
                        .slice((currPage - 1) * maxNumPerPage, currPage * maxNumPerPage)
                        .map(s => 
                            <Col 
                                key={s.id}
                                xs={12} md={6} lg={4} xl={3}
                            >
                                <Student {...s} />
                            </Col>)
                }
            </Row>
        </Container>
        {/* #8 */}
        <Pagination>
            <Pagination.Prev 
                onClick={() => setCurrPage(curr => curr - 1)}
                disabled={currPage <= 1}
            >Previous</Pagination.Prev>
            {
                buildPagination()
            }
            <Pagination.Next
                onClick={() => setCurrPage(curr => curr + 1)}
                disabled={currPage >= numPages}
            >Next</Pagination.Next>
        </Pagination>
    </div>

}

export default Classroom;