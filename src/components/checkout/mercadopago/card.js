
import Grid from '@mui/material/Grid';

import { 
        initMercadoPago, 
        CardNumber, 
        SecurityCode, 
        ExpirationDate, 
        ExpirationMonth,
        ExpirationYear 
    } from '@mercadopago/sdk-react';

import TextField from '@mui/material/TextField';

import './card.scss';

const CheckoutCardForm = ({nextForm,backForm}) => {

    initMercadoPago('TEST-8398884687248570-071814-773e8f542710a9465908e5cc466fd3cb-585666829');

    return (
        <form >
            <Grid container fullWidth spacing={2}>
                <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 12, }}>
                    <TextField 
                        label="Nombres completos" 
                        name="mpnombres"
                        fullWidth
                        id="mpnombres"
                        variant="filled"
                        //onChange={changeField}
                        //{...register("mpnombres")}
                    />
                </Grid>
                <Grid className={'textField textFieldWhite'} item size={{ xs: 12, sm: 12, md: 12, }}>
                    <TextField 
                        label="DNI:" 
                        name="mpdni"
                        fullWidth
                        id="mpdni"
                        variant="filled"
                        //onChange={changeField}
                        //{...register("mpdni")}
                    />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 8, }}>
                    <CardNumber placeholder="Card number" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 4, }}>
                    <SecurityCode placeholder="Security code" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 4, }}>
                    <ExpirationDate placeholder="Expiration date" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 4, }}>
                    <ExpirationMonth placeholder="Expiration month" />
                </Grid>
                <Grid className={ 'mpTextField' } item size={{ xs: 12, sm: 12, md: 4, }}>
                    <ExpirationYear placeholder="Expiration Year" />
                </Grid>
                
            </Grid>
        </form>
    )
};

export default CheckoutCardForm;
