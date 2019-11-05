import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { BankAccount } from "./BankAccount";
import { AppState, ActionTypes } from "../../../../redux/configureStore";

function mapStateToProps(state: AppState) {
    const content = state.User.Setting.Content;
    return {
        initialInvestment: content.InitialInvestment,
        allowableLossRate: content.AllowableLossRate,
        bankruptcyReductionRate: content.BankruptcyReductionRate,
        currencies: content.Currencies,
        stocks: content.Stocks
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
    return {
        //onClock: () => dispatch()
    };
}

const BankAccountContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(BankAccount);

export default BankAccountContainer;
