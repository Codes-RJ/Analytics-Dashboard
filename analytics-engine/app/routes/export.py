from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import pandas as pd
import io
from app.models.schemas import ExportRequest
from app.services.data_loader import load_dataframe

router = APIRouter()

@router.post("")
async def export_data(request: ExportRequest):
    """
    Export dataset to specified format
    """
    try:
        df = load_dataframe(request.file_path)
        
        # Create buffer based on format
        if request.format == 'csv':
            buffer = io.StringIO()
            df.to_csv(buffer, index=False)
            buffer.seek(0)
            media_type = 'text/csv'
            
        elif request.format == 'xlsx':
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                df.to_excel(writer, index=False)
            buffer.seek(0)
            media_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            
        elif request.format == 'json':
            buffer = io.StringIO()
            df.to_json(buffer, orient='records')
            buffer.seek(0)
            media_type = 'application/json'
            
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {request.format}")
        
        return StreamingResponse(
            buffer,
            media_type=media_type,
            headers={
                'Content-Disposition': f'attachment; filename=export.{request.format}'
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))