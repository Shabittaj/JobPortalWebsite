import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const Skills = () => {
    const [showModal, setShowModal] = useState(false);
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        skillName: '',
        proficiency: ''
    });
    const [selectedIndex, setSelectedIndex] = useState(null); // Track the index of the selected skill for editing

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleEdit = (index) => {
        const selectedSkill = skills[index];
        setFormData({
            skillName: selectedSkill.skillName,
            proficiency: selectedSkill.proficiency
        });
        setSelectedIndex(index);
        handleShowModal();
    };

    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/app/v1/profile/details', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await response.json();
            setSkills(data.details.skills || []);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            // Handle error appropriately
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/app/v1/profile/add-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ skills: [formData] }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            setSkills([...skills, formData]);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error appropriately
        }
    };

    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/app/v1/profile/update-details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ skills: [formData] }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedSkills = [...skills];
            updatedSkills[selectedIndex] = formData;
            setSkills(updatedSkills);
            handleCloseModal();
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error appropriately
        }
    };

    const handleSkillNameChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, skillName: value });
    };

    const handleProficiencyChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, proficiency: value });
    };

    return (
        <>
            <div>
                <div className="row">
                    <div className="col-lg-6">
                        <h5 className="mb-4 text-uppercase text-left">
                            <i className="fa fa-briefcase"></i> &nbsp; Skills
                        </h5>
                    </div>
                    <div className="col-lg-6">
                        <i type="button" className="fa fa-edit" onClick={handleShowModal} style={{ float: 'right' }}></i>
                    </div>
                </div>

                {/* Skills List */}
                {skills.map((skill, index) => (
                    <div key={index} className="row text-left p-3">
                        <div className="col-lg-10">
                            <h5>{skill.skillName}</h5>
                            <strong>{skill.proficiency}</strong> <br />
                        </div>
                        <div className="col-lg-2">
                            <Button className='btn btn-warning' onClick={() => handleEdit(index)}>Edit</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Skills Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedIndex !== null ? 'Edit Skill' : 'Add Skill'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Skills Form */}
                    <div className="row mt-2">
                        <div className="col-lg-12 mt-2">
                            <div className="form-group text-left">
                                <label htmlFor="skillName">Skill Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="skillName"
                                    value={formData.skillName}
                                    onChange={handleSkillNameChange}
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 mt-2">
                            <div className="form-group text-left">
                                <label htmlFor="proficiency">Proficiency</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="proficiency"
                                    value={formData.proficiency}
                                    onChange={handleProficiencyChange}
                                />
                            </div>
                        </div>
                        {/* Add other input fields similarly */}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {selectedIndex !== null ? (
                        <Button variant="primary" onClick={handleEditSave}>
                            Save Changes
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleSave}>
                            Add Skill
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};
