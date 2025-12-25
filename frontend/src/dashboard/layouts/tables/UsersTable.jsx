import React, { useEffect, useMemo, useState } from 'react';
import MDBox from '../../components/MDBox';
import MDBadge from '../../components/MDBadge';
import MDTypography from '../../components/MDTypography';
import { useDispatch, useSelector } from 'react-redux';
import { addUserFromApi, deleteUserFromApi, getUsersFromApi, updateUserFromApi } from '../../redux/usersSlice';
import Tables from '.';
import { Icon, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from '@mui/material';
import MDButton from '../../components/MDButton';
import { SkeletonLine, SkeletonLineShort } from '../../../components/Loading/style';

function UsersTable({ usersType, tableTitle = "جدول المستخدمين" }) {

    const { users, isLoading } = useSelector((state) => state.usersReducer);
    const dispatch = useDispatch();

    // State for modal
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setNameField('');
        setEmailField('');
        setPhoneField('');
        setPasswordFealed('');
        setConfermPasswordFealed('');
        setOpenModal(false)
    };


    // State for edit modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [nameFealed, setNameField] = useState('');
    const [emailFealed, setEmailField] = useState('');
    const [passwordFealed, setPasswordFealed] = useState('');
    const [confermPasswordFealed, setConfermPasswordFealed] = useState('');
    const [phoneFealed, setPhoneField] = useState('');


    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNameField(user.name);
        setEmailField(user.email);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedUser(null);
        setNameField('');
        setEmailField('');
        setEditModalOpen(false);
    };






    // Fetch users from API when component mounts
    useEffect(() => {
        dispatch(getUsersFromApi());
    }, []);

    const columns = useMemo(() => [
        { id: "name", Header: "الاسم", accessor: "name", align: "center" },
        { id: "role", Header: "role", accessor: "role", align: "center" },
        { id: "email", Header: "البريد الالكتروني", accessor: "email", align: "center" },
        { id: "isActive", Header: "isActive", accessor: "isActive", align: "center" },
        { id: "updatedAt", Header: "updatedAt", accessor: "updatedAt", align: "center" },
        { id: "action", Header: "action", accessor: "action", align: "center" },
    ], []);

    const rows = useMemo(() => {
        const usersToShow = users.filter(user => user.role === usersType);

        return usersToShow.map((user) => ({
            name: user.name,
            role: user.role,
            email: user.email,
            isActive: `${user.isActive}`,
            updatedAt: user.updatedAt,
            action: (
                <>
                    <MDTypography component="a" href="#" variant="caption" color="danger" fontWeight="medium">
                        <Icon fontSize="small" style={{ cursor: "pointer" }}
                            onClick={() => dispatch(deleteUserFromApi(user._id))}>
                            delete
                        </Icon>
                    </MDTypography>
                    <MDTypography component="a" href="#" variant="caption" color="danger" fontWeight="medium" ml="10px">
                        <Icon fontSize="small" style={{ cursor: "pointer" }}
                            onClick={() => handleEditUser(user)}>
                            edit
                        </Icon>
                    </MDTypography>
                </>
            ),
        }));
    }, [users, usersType]);


    // const loadingRows = useMemo(() => {
    //     return (
    //         Array.from({ length: 5 }, () => ({
    //             name: <SkeletonLine width="100%" />,
    //             role: <SkeletonLineShort width="100%" />,
    //             email: <SkeletonLineShort width="100%" />,
    //             isActive: <SkeletonLineShort width="100%" />,
    //             updatedAt: <SkeletonLineShort width="100%" />,
    //             action: <SkeletonLineShort width="100%" />
    //         }))
    //     )
    // },[isLoading]);


    return (
        <>
            <Tables tableTitle={tableTitle} rows={rows} columns={columns}>
                <Icon fontSize="large" style={{ cursor: "pointer" }} onClick={handleOpenModal}>
                    add_box
                </Icon>
            </Tables>

            {/* Modal for adding a new user */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogContent>
                    {/* Replace this with your actual form */}
                    <TextField fullWidth label="الاسم" margin="normal" value={nameFealed} onChange={(e) => setNameField(e.target.value)} />
                    <TextField fullWidth label="البريد الإلكتروني" margin="normal" value={emailFealed} onChange={(e) => setEmailField(e.target.value)} />
                    <TextField fullWidth label="رقم الهاتف" margin="normal" value={phoneFealed} onChange={(e) => setPhoneField(e.target.value)} />
                    <TextField fullWidth label="كلمة المرور" margin="normal" value={passwordFealed} onChange={(e) => setPasswordFealed(e.target.value)} />
                    <TextField fullWidth label="تأكيد كلمة المرور" margin="normal" value={confermPasswordFealed} onChange={(e) => setConfermPasswordFealed(e.target.value)} />
                    <TextField fullWidth label="الدور" margin="normal" disabled value={usersType} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>إلغاء</Button>
                    <Button variant="contained" color="primary" onClick={() => {
                        // Add user logic here
                        dispatch(addUserFromApi({
                            name: nameFealed,
                            email: emailFealed,
                            role: usersType,
                            phone: phoneFealed,
                            password: passwordFealed,
                            confirmPassword: confermPasswordFealed,
                            isActive: true,
                            updatedAt: new Date().toISOString(),
                        }))
                        handleCloseModal();
                        
                    }}>
                        <Typography fontSize='small' fontWeight="medium" color="white">إضافة</Typography>
                    </Button>
                </DialogActions>
            </Dialog>



            <Dialog open={editModalOpen} onClose={handleCloseEditModal}>
                <DialogTitle>تعديل المستخدم</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="الاسم"
                        margin="normal"
                        value={nameFealed}
                        onChange={(e) => setNameField(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        margin="normal"
                        value={emailFealed}
                        onChange={(e) => setEmailField(e.target.value)}
                    />
                    <TextField
                        disabled
                        fullWidth
                        label="الدور"
                        margin="normal"
                        defaultValue={selectedUser?.role}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>إلغاء</Button>
                    <Button variant="contained" color="primary" onClick={() => {

                        dispatch(updateUserFromApi({
                            _id: selectedUser._id,
                            name: nameFealed,
                            email: emailFealed,
                        }));

                        handleCloseEditModal();
                    }}>
                        <Typography fontSize='small' fontWeight="medium" color="white">تحديث</Typography>
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default UsersTable;
