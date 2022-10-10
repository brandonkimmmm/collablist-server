import { Transform } from 'class-transformer';
import { isUndefined } from 'lodash';

const Default = (defaultValue: any) => {
    return Transform((target: any) =>
        isUndefined(target.value) ? defaultValue : target.value
    );
};

export default Default;
