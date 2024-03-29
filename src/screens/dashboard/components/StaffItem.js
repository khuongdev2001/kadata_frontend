import React from "react";
import { BoxFlex } from "../../../components";
import styles from "./staffItem.module.scss";
import { Autocomplete, TextField, Button } from "@mui/material";
import { Close, Add } from '@mui/icons-material';
import { useAxiosAuth } from "../../../hook/api";
import AssignStaffValidate from "../validates/AddStaff";

function StaffItem({ advise, setAdvise, errors, onSetErrorEmpty }) {
    // set error inline
    const [error, setError] = React.useState({});
    const [staffOptions, setStaffOptions] = React.useState([]);
    const staffs = advise.staff;
    const [staff, setStaff] = React.useState({
        id: null,
        fullname: ""
    });

    React.useEffect(() => {
        useAxiosAuth.get("admin/staff")
            .then(response => {
                const result = response.data;
                if (result.status) {
                    setStaffOptions(result.data.items);
                }
            })
    }, []);

    function handleAddStaff({ id, fullname }) {
        // set error inline
        const error = AssignStaffValidate({ fullname });
        setError(error);
        onSetErrorEmpty();
        if (Object.keys(error).length) {
            return false;
        }
        setAdvise((advise) => {
            return {
                ...advise,
                staff: [
                    ...advise.staff,
                    {
                        id,
                        fullname
                    }
                ]
            }
        })

        setStaff({
            id: null,
            fullname: ""
        });
    }

    function handleDeleteCustomer(index) {
        const staff = advise.staff;
        staff.splice(index, 1);
        setAdvise((advise) => {
            return {
                ...advise,
                advise: [
                    ...staff
                ]
            }
        })
    }

    function handleSetOption(staff) {
        const index = staffs.findIndex(item => {
            return item.id == staff.id;
        })
        if (index != -1) {
            return "";
        }
        else {
            return staff.fullname;
        }
    }

    function handleRenderOption(props, staff) {
        const index = staffs.findIndex(item => {
            return item.id == staff.id;
        })
        if (index == -1) {
            return (<li {...props}>
                {staff.fullname}
            </li>);
        }
    };

    return (<div className={styles.wpStatff}>
        <div className={styles.topTitle}>
            <h4>Nhân Viên</h4>
        </div>
        <BoxFlex alignItems="center">
            <Autocomplete
                id="highlights-demo"
                sx={{ mb: 0 }}
                fullWidth
                options={staffOptions}
                size="small"
                onChange={(e, newValue) => setStaff(newValue)}
                getOptionLabel={handleSetOption}
                renderOption={handleRenderOption}
                renderInput={(params) => (
                    <TextField
                        error={Boolean(error.fullname ? error.fullname : errors.staff)}
                        helperText={error.fullname ? error.fullname : errors.staff}
                        {...params} label="Nhân Viên" margin="normal" />
                )}
            />
        </BoxFlex>
        <div className={styles.listStaff}>
            {
                staffs.map((staff, index) => {
                    return (
                        <BoxFlex justifyContent="space-between" alignItems="center" className={styles.listStaffItem}>
                            <span className={styles.staffName}>{staff.fullname}</span>
                            <Button
                                onClick={() => handleDeleteCustomer(index)}
                                className={styles.btnRemove} size="sm" variant="contained" color="error">
                                <Close fontSize="10" />
                            </Button>
                        </BoxFlex>
                    )
                })
            }
        </div>
        <div className={styles.staffCreate}>
            <Button variant="contained" onClick={() => handleAddStaff(staff)} size="small">
                <Add />
            </Button>
        </div>
    </div>)
}

export default StaffItem;