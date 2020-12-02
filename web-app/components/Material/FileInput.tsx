import React, { FC, useCallback, useEffect } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useFormContext } from 'react-hook-form'

interface IFileInputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string
  mode?: 'update' | 'append'
}

const FileInput: FC<IFileInputProps> = (props) => {
  const { name, label = name, mode = 'update' } = props
  const {
    register,
    unregister,
    setValue,
    watch,
  } = useFormContext()
  const files: File[] = watch(name)
  const onDrop = useCallback<DropzoneOptions['onDrop']>(
    (droppedFiles) => {
      /*
         This is where the magic is happening.
         Depending upon the mode we are replacing old files with new one,
         or appending new files into the old ones, and also filtering out the duplicate files.
      */
      let newFiles = mode === 'update' ? droppedFiles : [...(files || []), ...droppedFiles]
      if (mode === 'append') {
        newFiles = newFiles.reduce((prev, file) => {
          const fo = Object.entries(file)
          if (
            prev.find((e: File) => {
              const eo = Object.entries(e)
              return eo.every(
                ([key, value], index) => key === fo[index][0] && value === fo[index][1],
              )
            })
          ) {
            return prev
          } else {
            return [...prev, file]
          }
        }, [])
      }
      // End Magic.
      setValue(name, newFiles, { shouldValidate: true })
    },
    [setValue, name, mode, files],
  )
  // ---- no changes here, same code as above ----
}

export default FileInput
