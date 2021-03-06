import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getProFileAction } from '../redux/actions/MemberManageAction'
import moment from 'moment'
import { Icon, Table, Tag, Button, Modal, Tooltip, Checkbox, Spin, Switch } from 'antd'
import { cancelTicketAction, huyVeAction } from '../redux/actions/BookingManageAction'
import { getSettingAction } from '../redux/actions/SettingAction'
import { showMessageAlert } from '../templates/SweetAlert'
import Item from 'antd/lib/list/Item'

const { confirm } = Modal;

class ProfileUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taiKhoan: this.props.match.params.taiKhoan,
            visible: false,
            listTicket: [],
            ngayChieu: '',
            setting: [],
            dangChon: false,
            danhSachVeHuy: [],
            durationHuy: 0,
            classTrangThaiVe: ''
        }
    }

    componentDidMount() {
        this.props.getProfile(this.state.taiKhoan);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log("nextProps", nextProps);
        // console.log("prevState", prevState);
        if (prevState.setting != nextProps.setting) {
            return {
                ...prevState, setting: nextProps.setting
            }
        }
        return null
    }


    handleOpenList = (record) => {
        console.log('record', record);
        this.setState({
            visible: !this.state.visible,
            listTicket: record,
        })
    }

    handleOk = e => {
        console.log(e);
        let danhSachVeHuy = this.state.danhSachVeHuy;
        let danhSachTemp = [];
        if(danhSachVeHuy.length === 0){
            showMessageAlert('Warning', "Please choose cancel tickets", 'warning')
        }
        else{
            danhSachVeHuy.map((veHuy, index) => {
                danhSachTemp.push({
                    MaVe: veHuy.MaVe,
                    GiaVe: veHuy.GiaVe,
                })
            })
            let mucHoanTra = this.props.setting.map(item => {
                return item.Setting
            })
            let objectVeHuy ={
                MucHoanTra: parseInt(mucHoanTra), //L???y m???c ho??n tr???
                DanhSachVeHuy: danhSachVeHuy
            }
            this.props.cancelTicket(objectVeHuy)
            // console.log("danhSachVeHuy", danhSachVeHuy, this.props.setting);            
        }
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    checkConditionCancel = (duration) => {
        // if (duration > 0 && duration <= 1) {
        //     showMessageAlert('Notification', 'B???n kh??ng th??? h???y v??. L?? do: c???n ng??y chi???u!', 'warning')
        // }

        // N???u ng??y h???y c??ch ng??y chi???u > 5 ng??y th?? m???c ho??n ti???n 50%
        if (duration > 5) {
            this.props.getSetting('HT2');
        }
        // N???u ng??y h???y c??ch ng??y chi???u t??? 2 ?????n 5 ng??y th?? m???c ho??n ti???n 20%
        else if (duration <= 5 && duration > 1) {
            this.props.getSetting('HT1');
        }
    }

    cancelTicket = (duration, record) => {
        // console.log("record Huy", record);
        console.log("duration", duration);
        this.checkConditionCancel(duration);
        const veDuocChon = {
            MaVe: record.MaVe,
            TenGhe: record.TenGhe,
            GiaVe: record.GiaVe,        
        } 
        
        let array = this.state.danhSachVeHuy;
        let index = array.findIndex(ve => ve.MaVe === veDuocChon.MaVe);
        if (index !== -1) {
            array.splice(index, 1)            
        }
        else {  
            array.push(veDuocChon);
            // this.setState({
            //     classTrangThaiVe: 'veDangChon'
            // })
        }
        this.setState({
            danhSachVeHuy: array
        }, () => {
            console.log(this.state.danhSachVeHuy);
        })
    }

    // cancelTicket = (duration, maThanhToan) => {
    //     // alert(duration + ' ' + maThanhToan + ' ' + this.state.setting)
    //     if (duration > 0 && duration <= 1) {
    //         showMessageAlert('Notification', 'B???n kh??ng th??? h???y v??. L?? do: c???n ng??y chi???u!', 'warning')
    //     }
    //     else if (duration >= 5) {
    //         this.props.getSetting('HT2');
    //     }
    //     else if (duration < 5 && duration > 1) {
    //         this.props.getSetting('HT1');
    //     }
    //     let mucHoanTien = 0;
    //     setTimeout(() => {
    //         this.state.setting.map(st => {
    //             mucHoanTien = st.Setting
    //         })
    //         this.showDeleteConfirm(maThanhToan, mucHoanTien);
    //     }, 2000);

    // }

    showDeleteConfirm = async (maThanhToan, mucHoanTien) => {

        confirm({
            title: 'Are you sure delete this task?',
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                let objectHuyVe = {
                    maThanhToan: maThanhToan,
                    mucHoanTien: mucHoanTien
                }
                this.props.cancelTicket(objectHuyVe)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {
        const profileInfor = this.props.profileInfor;
        const columns = [
            { title: 'M?? Thanh To??n', dataIndex: 'MaThanhToan', key: 'MaThanhToan ', align: 'center' },
            { title: 'C???m R???p', dataIndex: 'TenCumRap', key: 'TenCumRap ', align: 'center', },
            { title: 'Phim', dataIndex: 'TenPhim', key: 'TenPhim', align: 'center' },
            {
                title: 'Ng??y Chi???u', dataIndex: 'NgayChieuGioChieu', key: 'NgayChieu', align: 'center',
                render: (NgayChieuGioChieu) => {
                    let NgayChieu = new Date(NgayChieuGioChieu)
                    return (
                        <span>{NgayChieu.toLocaleDateString()}</span>
                    )
                }
            },
            {
                title: 'Su???t Chi???u', dataIndex: 'NgayChieuGioChieu', key: 'GioChieu', align: 'center',
                render: (NgayChieuGioChieu) => {
                    let NgayChieu = new Date(NgayChieuGioChieu)
                    return (
                        <span>{NgayChieu.toLocaleTimeString()}</span>
                    )
                }
            },
            {
                title: 'Ng??y ?????t', dataIndex: 'NgayDat', key: 'NgayDat', align: 'center',
                render: (NgayDat) => {
                    let Ngay = new Date(NgayDat)
                    return (
                        <span>{Ngay.toLocaleDateString()}</span>
                    )
                }
            },
            {
                title: 'Gi??? ?????t', dataIndex: 'NgayDat', key: 'GioDat', align: 'center',
                render: (NgayDat) => {
                    let GioDat = new Date(NgayDat)
                    return (
                        <span>{GioDat.toLocaleTimeString()}</span>
                    )
                }
            }
        ];

        const data = this.props.profileInfor.ThongTinDatVe;

        const columnsExpended = [
            { title: 'M?? V??', dataIndex: 'MaVe', key: 'MaVe', align: 'center', },
            { title: 'M?? Gh???', dataIndex: 'MaGhe', key: 'MaGhe', align: 'center', },
            { title: 'T??n Gh???', dataIndex: 'TenGhe', key: 'TenGhe', align: 'center', },
            { title: 'Gi?? V??', dataIndex: 'GiaVe', key: 'GiaVe', align: 'center', },
            {
                title: 'Ch???n H???y',
                key: 'TrangThaiHuy',
                align: 'center',
                render: (record) => {
                    let thoiGianChieu = (new Date(this.state.listTicket.NgayChieuGioChieu)).toLocaleDateString();
                    let now = moment(new Date()).format("DD.MM.YYYY"); //todays date
                    let startDate = moment(thoiGianChieu, "DD.MM.YYYY");
                    let endDate = moment(now, "DD.MM.YYYY");
                    const duration = startDate.diff(endDate, 'days');
                    console.log(duration);
                    // disabled={duration <= 0 || record.TrangThaiHuy} onClick={() => { this.cancelTicket(duration, record.MaThanhToan) }}
                    if (record.TrangThaiHuy) {

                    }
                    console.log("Switch", record);

                    return (
                        <div>
                            <Switch disabled={record.TrangThaiHuy || duration <= 1} onClick={() => this.cancelTicket(duration, record)} />
                            {/* <Button className={"button__title__icon " + `${this.state.classTrangThaiVe}`} type="danger" icon="delete" size={"small"} onClick={() => {  }}> Cancel </Button> */}
                        </div>
                    )
                },
            },
        ];

        return (
            <div>
                <div className="profile__bg">
                    {/* <div className="coming__bg__overlay"></div> */}
                    <div className="container d-flex justify-content-between" style={{ paddingTop: "170px" }}>
                        <div className="profile__content">
                            <div className="border__bottom pb-4" style={{ textAlign: "center" }}>
                                <img src={process.env.PUBLIC_URL + "/images/uploads/userava.png"} alt="" width={100} />
                                <div className="mt-4">
                                    <Tag color="gold" style={{ width: "65px", fontSize: "14px", fontWeight: "bold" }}>Edit</Tag>
                                    <Tag color="gold" style={{ width: "65px", fontSize: "14px", fontWeight: "bold" }}>Logout</Tag>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between my-4 border__bottom">
                                <span className="span__title__icon color-text">
                                    <Icon type="smile" rotate={180} />
                                    <span>&nbsp;&nbsp;Name</span>
                                </span>
                                <span>{profileInfor.HoTen}</span>
                            </div>
                            <div className="d-flex justify-content-between border__bottom my-4">
                                <span className="span__title__icon color-text">
                                    <Icon type="mail" />
                                    <span>&nbsp;&nbsp;Email</span>
                                </span>
                                <span>{profileInfor.Email}</span>
                            </div>
                            <div className="d-flex justify-content-between border__bottom my-4">
                                <span className="span__title__icon color-text">
                                    <Icon type="phone" />
                                    <span>&nbsp;&nbsp;Phone</span>
                                </span>
                                <span>{profileInfor.SoDT}</span>
                            </div>
                            <div className="d-flex justify-content-between border__bottom my-4">
                                <span className="span__title__icon color-text">
                                    <Icon type="crown" />
                                    <span>&nbsp;&nbsp;Membership</span>
                                </span>
                                <span>{profileInfor.LoaiNguoiDung}</span>

                            </div>
                            <div className="d-flex justify-content-between border__bottom my-4">
                                <span className="span__title__icon color-text">
                                    <Icon type="money-collect" />
                                    <span>&nbsp;&nbsp;Amount ticket</span>
                                </span>
                                <span className="color-text">{profileInfor.SoLuongVeDaMua}</span>
                            </div>
                        </div>

                        <div className="history__content">
                            <div className="" style={{ float: "right", marginBottom: "10px" }}>
                                <Tag color="#ed7532" style={{ fontSize: "16px", padding: "5px" }}> <span className="span__title__icon">
                                    <Icon type="clock-circle" />
                                    <span>&nbsp;&nbsp;History booking</span>
                                </span></Tag>
                            </div>
                            <Table
                                bordered
                                pagination={{
                                    defaultPageSize: 3,
                                }}
                                rowKey={record => record.MaThanhToan}
                                className="components-table-demo-nested"
                                columns={columns}
                                onRow={(record) => ({
                                    onDoubleClick: () => (this.handleOpenList(record)),
                                })}
                                // expandedRowRender={(record) =>
                                //     <Table rowKey={(record) => record.MaVe} columns={columnsExpended} dataSource={record.DanhSachGhe} pagination={false} />
                                // }
                                dataSource={data}
                            />
                            <Modal className="modal__list__ticket"
                                title="List ticket booked"
                                visible={this.state.visible}
                                // footer={false}
                                okText="Send request cancel"
                                cancelText="Exit"
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <Table size='small' rowKey={(record) => record.MaVe} columns={columnsExpended} dataSource={this.state.listTicket.DanhSachGhe} pagination={false} />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        profileInfor: state.MemberManageReducer.profileInfor,
        setting: state.SettingReducer.setting,
        danhSachVeDuocChon: state.BookingManageReducer.danhSachVeDuocChon
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProfile: (taiKhoan) => {
            dispatch(getProFileAction(taiKhoan));
        },
        cancelTicket: (objectHuyVe) => {
            dispatch(cancelTicketAction(objectHuyVe))
        },
        chonVeHuy: (veDangChon) => {
            dispatch(huyVeAction(veDangChon))
        },
        getSetting: (setting) => {
            dispatch(getSettingAction(setting))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUser)