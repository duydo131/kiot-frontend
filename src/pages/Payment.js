import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


import { useDispatch, useSelector } from 'react-redux';
import { actEnableToast} from 'src/actions/index'
import callApiHttp from "./../utils/api"


function Payment() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const infoPayment = useSelector(state => state.payment);

    const toast = (message) => dispatch(actEnableToast(message));

    async function SubmitForm(e) {
        var cardId = document.getElementById('txtCardId').value;
        var bank = document.getElementById('txtBank').value;
        if (cardId === "" || bank === "") {
            toast("Thiếu thông tin thanh toán")
            return
        }
        var payload = {
          "card_id": cardId,
          "bank": bank,
          "amount": infoPayment.amount,
          "handler_id": infoPayment.handler_id,
          "type": infoPayment.type
        }
        try{
            const res = await callApiHttp({
                url: '/payments',
                method: 'POST',
                data: payload
            })
            const {id} = res?.data?.data

            console.log(id)
            const success = await callApiHttp({
              url: '/after-payment/success',
              method: 'POST',
              data: {
                id
              }
            })
            toast("Thanh toán thành công!!!")
            // history.push('/')
            navigate('/dashboard/terminals', { replace: true });
        }catch(e){
            console.log("e", e)
            let err = e?.response?.data?.data
            let errText = 'Đặt hàng thất bại'
            if(typeof(err) === 'object'){
                errText = ''
                for ( let key in err){
                    errText += `${key} : ${err[key]} \n`
                }
            }
            toast(errText)
        }
    }

    return (
        <div className="top-bar">
            <div className="container">
                <div className="row" >
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 center-block">

                            <legend>Thanh toán</legend>

                            <div className="form-group text-left">
                                <label >Số tài khoản</label>
                                <input type="text" className="form-control" id="txtCardId" placeholder="Nhập số tài khoản" />
                            </div>

                            <div className="form-group text-left">
                                <label >Ngân hàng</label>
                                <input type="text" className="form-control" id="txtBank" placeholder="Nhập ngân hàng" />
                            </div>
                              <h4>
                              <strong>Tổng Tiền:  {infoPayment.amount} đồng</strong>
                              </h4>
                            <button type="submit" onClick={SubmitForm} className="btn btn-primary center-block">Submit</button>``
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
