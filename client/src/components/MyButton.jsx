import Button from 'react-bootstrap/Button';

export default function MyButton(props) {
  return (
    <Button variant={props.variant || 'primary'}
            onClick={props.onClick} type={props.type || 'button'}
            size={props.size || 'md'}
            disabled={props.disabled || false}
            style={props.disabled && props.variant === "dark" ? { backgroundColor: "#444", borderColor: "#444", color: "#ccc" } : {}}
    >
      {props.disabled ? "" : props.text}
    </Button>
  );
}