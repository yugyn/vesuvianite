import * as Icon from 'react-bootstrap-icons';

export const AppIcons = {

    Search: (props) => <Icon.Search {...props} />,
    ClearFields: (props) => <Icon.EraserFill {...props} />,
    Trash: (props) => <Icon.Trash {...props} />,
    Add: (props) => <Icon.PlusLg {...props} />,

    View: {
        Table: (props) => <Icon.ListColumns {...props} />,
        List: (props) => <Icon.List {...props} />,
    },

    Mineral: {

        Genesis: {
            Undefined: (props) => <Icon.QuestionCircle {...props} />,
            Normal: (props) => <Icon.Circle {...props} />,
            Fumarolic: (props) => <Icon.CircleFill {...props} />,
            Both: (props) => <Icon.CircleHalf {...props} />,
        },

    },
};