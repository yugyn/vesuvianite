import * as Icon from 'react-bootstrap-icons';

export const AppIcons = {

    Search: (props) => <Icon.Search {...props} />,
    ClearFields: (props) => <Icon.EraserFill {...props} />,
    Trash: (props) => <Icon.Trash {...props} />,
    Add: (props) => <Icon.PlusLg {...props} />,
    Edit: (props) => <Icon.Pencil {...props} />,
    Delete: (props) => <Icon.XCircle {...props} />,
    Restore: (props) => <Icon.Recycle {...props} />,
    Back: (props) => <Icon.ArrowLeftCircle {...props} />,
    Next: (props) => <Icon.CaretRightFill {...props} />,
    Prev: (props) => <Icon.CaretLeftFill {...props} />,
    Download: (props) => <Icon.Download {...props} />,
    Website: (props) => <Icon.Globe {...props} />,
    Email: (props) => <Icon.Envelope {...props} />,
    Map: (props) => <Icon.PinMap {...props} />,
    Play: (props) => <Icon.PlayFill {...props} />,

    View: {
        Table: (props) => <Icon.ListColumns {...props} />,
        List: (props) => <Icon.List {...props} />,
    },

    Zoom: {
        In: (props) => <Icon.ZoomIn {...props} />,
        Out: (props) => <Icon.ZoomOut {...props} />,
        Reset: (props) => <Icon.AspectRatio {...props} />,
    },

    Screen: {
        Full: (props) => <Icon.ArrowsFullscreen {...props} />,
        Resize: (props) => <Icon.ArrowsAngleContract {...props} />,
    },

    Open: {
        External: (props) => <Icon.BoxArrowUp {...props} />,
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