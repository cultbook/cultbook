import React, { useEffect, useRef, useState } from 'react';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import auth from 'solid-auth-client';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Loader from './Loader';

const useStyles = makeStyles(theme => ({
  uploader: {
  },
  cropper: {
    maxHeight: theme.spacing(50)
  },
  previewImage: {
    display: "block",
    height: theme.spacing(30),
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  altTextField: {
    width: "100%",
    marginTop: theme.spacing(2),
  }
}))

const ImageEditingModal = ({src, onSave, onClose, ...props}) => {
  const [saving, setSaving] = useState()
  const classes = useStyles()
  const cropper = useRef()
  const save = async () => {
    setSaving(true)
    await onSave(cropper.current.getCroppedCanvas())
    setSaving(false)
  }
  return (
    <Dialog onClose={onClose} {...props}>
      <DialogContent>
        <Cropper
          ref={cropper}
          className={classes.cropper}
          src={src}
          crossOrigin="use-credentials"
        />
        <Button onClick={() => {
          cropper.current.rotate(90)
        }}>
          rotate
        </Button>
      </DialogContent>
      <DialogActions>
        {saving ? (
          <Loader/>
        ) : (
          <>
            <Button onClick={save}>
              save
            </Button>
            <Button onClick={onClose}>
              cancel
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

const typesToExts = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp"
}

const extForFile = file => {
  const extFromType = typesToExts[file.type]
  if (extFromType) {
    return extFromType
  } else {
    return file.name.split(".").slice(-1)[0]
  }
}

const uploadFromCanvas = (canvas, containerUri, type) => new Promise((resolve, reject) => {
  canvas.toBlob(async (blob) => {
    const response = await auth.fetch(containerUri, {
      method: 'POST',
      force: true,
      headers: {
        'content-type': type,
        credentials: 'include'
      },
      body: blob
    });
    if (response.ok){
      resolve(response)
    } else {
      reject(response)
      console.log("image upload failed: ", response)
    }
  }, type, 1)

})


export function ImageEditor({element, onClose, onSave, ...props}) {

  const {url, originalUrl, mime} = element
  return (
    <ImageEditingModal src={originalUrl || url}
                       onClose={onClose}
                       onSave={async (canvas) => {
                         await uploadFromCanvas(canvas, url, mime)
                         onSave(url)
                       }} {...props}/>
  )
}

export default ({onClose, onUpload, uploadDirectory, ...props}) => {
  const classes = useStyles()
  const inputRef = useRef()
  const [file, setFile] = useState()
  const [originalSrc, setOriginalSrc] = useState()
  const [previewSrc, setPreviewSrc] = useState()
  const [altText, setAltText] = useState("")
  const [contentWarning, setContentWarning] = useState(false)
  const [croppedCanvas, setCroppedCanvas] = useState()
  const [editing, setEditing] = useState(false)

  const insert = async () => {
    const response = await uploadFromCanvas(croppedCanvas, uploadDirectory, file.type)
    onUpload && onUpload(response, altText, file.type, contentWarning)
    onClose && onClose()
  }

  useEffect(() => {
    let newSrc;
    if (file){
      newSrc = URL.createObjectURL(file)
      setOriginalSrc(newSrc)
      setPreviewSrc(newSrc)
      setEditing(true)
    }
    return () => {
      if (newSrc){
        URL.revokeObjectURL(newSrc)
      }
    }
  }, [file])

  const onFileChanged = event => {
    if (event.target.files) {
      const file = event.target.files[0]
      setFile(file)
    }
  }

  return (
    <Dialog className={classes.uploader} onClose={onClose} {...props}>
      <DialogContent>
        {previewSrc && (
          <>
            <img src={previewSrc} className={classes.previewImage} alt={altText}/>
            <TextField value={altText} label="describe this image for those without sight"
                       variant="filled" size="small"
                       className={classes.altTextField}
                       onChange={(e) => setAltText(e.target.value)}/>
            <FormControlLabel
              control={<Checkbox
                         checked={contentWarning}
                         onChange={(e) => setContentWarning(!!e.target.checked)}
                         inputProps={{ 'aria-label': 'primary checkbox' }}
                       />}
              label="content warning?"
            />

          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => inputRef.current.click()}>
          pick a file
        </Button>
        {croppedCanvas &&
         <>
           <Button onClick={() => setEditing(true)}>
             edit
           </Button>
           <Button onClick={insert}>
             upload
           </Button>
         </>
        }
        <Button onClick={() => onClose()}>
          cancel
        </Button>
      </DialogActions>
      <input
        ref={inputRef}
        accept="image/*"
        style={{ display: 'none' }}
        type="file"
        onChange={onFileChanged}
      />
      <ImageEditingModal open={editing} src={originalSrc}
                         onClose={onClose}
                         onSave={async (canvas) => {
                           setPreviewSrc(canvas.toDataURL(file.type))
                           setCroppedCanvas(canvas)
                           setEditing(false)
                         }}/>
    </Dialog>
  )
}
