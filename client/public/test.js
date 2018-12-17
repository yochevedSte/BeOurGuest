



<div className="display_result" style={{ backgroundColor: `${this.state.background}` }}>

    <h2 style={{ color: `${this.state.titleColor}`, fontFamily: `${this.state.fontTitle}` }}>{this.state.titleInput}</h2>
    <div style={{ whiteSpace: "pre-wrap", padding: "10px", color: `${this.state.bodyColor}`, fontFamily: `${this.state.fontBody}` }}>
        <h4 >{this.state.textInput}</h4>
    </div>
    <p>{this.state.whenEvent} <br />
        {this.state.whereEvent}</p>
</div>