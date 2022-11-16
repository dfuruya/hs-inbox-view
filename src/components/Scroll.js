function Scroll({ children }) {
  return (
    <div className="inbox-left-container">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          style: { ...child.props.style },
        })
      )}
    </div>
  );
}

export default Scroll;
