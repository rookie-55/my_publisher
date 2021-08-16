import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import { EditorState, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState('')
    useEffect(() => {

        const html = props.content;
        if(html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content])
    return (
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(editorState) => {
                setEditorState(editorState)
            }}

            onBlur={() => {
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
        />
    )
}


// import 'braft-editor/dist/index.css'
// import React, { useState } from 'react'
// import BraftEditor from 'braft-editor'

// export default function NewsEditor() {
//     const [editorState, setEditorState] = useState(BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'))
//     const [outputHTML, setOutputHTML] = useState('<p></p>')
//     const handleChange = (editorState) => {
//         setEditorState(editorState)
//     }
//     const onBlurChange = ()=>{
//         setOutputHTML(editorState.toHTML())
//     }
//     return (
//         <div>
//             <div className="editor-wrapper" >
//                 <BraftEditor
//                     value={editorState}
//                     onChange={handleChange}
//                     contentStyle={{ height: "250px" }}
//                     onBlur={
//                         console.log('editorState.toHTML :>> ', editorState.toHTML())
//                     }
//                 />
//             </div>
//             {/* <h5>输出内容</h5>
//             <div className="output-content">{outputHTML}</div> */}
//         </div>
//     )
// }
