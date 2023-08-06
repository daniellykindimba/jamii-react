import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  onChange: any;
  data?: any;
}
export const CKEditorComponent: React.FC<Props> = (props: Props) => {
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        }}
        data={props.data}
        onReady={(editor: any) => {
          editor.editing.view.change(
            (writer: {
              setStyle: (arg0: string, arg1: string, arg2: any) => void;
            }) => {
              writer.setStyle(
                "height",
                "200px",
                editor.editing.view.document.getRoot()
              );
            }
          );
        }}
        onChange={(event: any, editor: {getData: () => any}) => {
          const data = editor.getData();
          props.onChange(data);
        }}
        onBlur={(event: any, editor: any) => {
          const data = editor.getData();
          props.onChange(data);
        }}
        onFocus={(event: any, editor: any) => {
          const data = editor.getData();
          props.onChange(data);
        }}
      />
    </>
  );
};
